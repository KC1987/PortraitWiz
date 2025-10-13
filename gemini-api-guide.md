Here is a full guide (in Markdown format) for an AI coder on how to use the Gemini Image Generation API in a Next.js (or Node / browser-fetch) environment. It covers setup, auth, usage patterns, error handling, and tips & best practices based on the official doc.

You can copy this into a .md file (e.g. gemini-image-nextjs.md).

# Gemini Image Generation API — Next.js / Fetch Guide

This guide will walk you through integrating Google’s Gemini (a.k.a. “Nano Banana”) image generation API within a Next.js (or similar) environment using the `fetch` API (or serverless / edge functions).

Based on the official Gemini documentation:  
[Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation) :contentReference[oaicite:0]{index=0}

---

## Table of Contents

1. Introduction & capabilities
2. Setup: API key, models, endpoints
3. Request structure & payloads
    - Text-to-image
    - Image editing (text + image)
    - Other modes (composition, multi-turn)
4. Integrating in Next.js / fetch
    - Server component / API route example
    - Edge / middleware considerations
    - Client-side vs server-side
5. Response parsing & decoding
6. Error handling & retries
7. Prompt strategies & best practices
8. Security / usage considerations
9. Example: full Next.js API route + client usage
10. Summary / checklist

---

## 1. Introduction & Capabilities

Gemini’s image generation API allows you to:

- **Text-to-image**: generate images from descriptive text prompts :contentReference[oaicite:1]{index=1}
- **Image editing / text + image**: upload an image and combine with text instructions to modify it (e.g. add/remove objects) :contentReference[oaicite:2]{index=2}
- **Composition / style transfer / multiple-image input**: combine multiple images + text to generate new images or transfer style :contentReference[oaicite:3]{index=3}
- **Iterative refinement / multi-turn**: you can adjust or evolve the image over multiple prompt-response turns in a chat-like flow :contentReference[oaicite:4]{index=4}

All generated images include a watermark (SynthID) by default. :contentReference[oaicite:5]{index=5}

---

## 2. Setup: API Key, Models & Endpoint

### API Key & Access

- You need a valid **Gemini API key** or credential to call the service (often via Google API credentials).
- Requests must include your API key, usually via header `x-goog-api-key`. :contentReference[oaicite:6]{index=6}
- The endpoint for REST calls is:



POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent


For example, for the “flash image” model:  
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent` :contentReference[oaicite:7]{index=7}

### Model Names

- The current model for image tasks is e.g. `gemini-2.5-flash-image` :contentReference[oaicite:8]{index=8}
- You may see newer variants or versions in the API docs; always confirm the exact model name.
- You may also have to inspect what capabilities (max size, input types) each model supports.

---

## 3. Request Structure & Payloads

The Gemini image API uses a **`contents`** array, where each element is a “part” which may be:

- A **text** prompt (plain text)
- An **inlineData** blob (base64-encoded image, with MIME type)

### Basic Text-to-Image

You can send a single text prompt. Example JSON:

```json
{
"contents": [
  {
    "parts": [
      { "text": "A futuristic city skyline at sunset, with flying cars" }
    ]
  }
]
}

Text + Image (Editing / Modification)

If you want to supply an input image plus instructions, you build contents with multiple parts:

{
  "contents": [
    {
      "parts": [
        { "text": "Using the provided image, add a small red balloon to the sky." },
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "<base64-encoded-image>"
          }
        }
      ]
    }
  ]
}


The inlineData part must include mimeType and the base64 string of the image.

The prompt parts and inline data parts are interleaved (order matters). 
Google AI for Developers

Gemini will try to match style, lighting, and other visual attributes of the input image when performing edits. 
Google AI for Developers

Mixed Modes, Multi-turn, Composition

You can intermix multiple prompt parts and images.

Because Gemini supports “multi-image to image” or composition, you can give more than one image input plus text. 
Google AI for Developers

In a conversational style, you can iteratively refine or prompt edits over subsequent calls (maintaining context). 
Google AI for Developers

4. Integrating in Next.js / fetch

Here’s how you might integrate this in a Next.js application, using server-side or API routes to call Gemini, then deliver images to clients.

A. Server-side / API Route (Node / Next.js)

You should prefer making Gemini API calls from your server (Next.js API routes or server components), keeping the API key secret.

Example (Next.js API route: /pages/api/generate-image.ts or app/api/generate-image/route.ts):

import type { NextApiRequest, NextApiResponse } from 'next'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash-image'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { prompt, imageBase64, mimeType } = req.body

  // Build contents array
  const parts: any[] = []
  parts.push({ text: prompt })
  if (imageBase64 && mimeType) {
    parts.push({
      inlineData: {
        mimeType,
        data: imageBase64
      }
    })
  }

  const body = { contents: [ { parts } ] }

  try {
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY ?? ''
        },
        body: JSON.stringify(body)
      }
    )

    if (!apiRes.ok) {
      const err = await apiRes.text()
      console.error('Gemini API error:', err)
      return res.status(500).json({ error: 'Failed to generate image', details: err })
    }

    const data = await apiRes.json()
    // Extract the image data
    const candidates = data.candidates
    if (!candidates || candidates.length === 0) {
      return res.status(500).json({ error: 'No candidates returned' })
    }
    const partsOut = candidates[0].content.parts
    const inlinePart = partsOut.find((p: any) => p.inlineData)
    if (!inlinePart) {
      return res.status(500).json({ error: 'No image data in candidate' })
    }

    // Respond with base64 (or buffer) to client
    res.status(200).json({ imageBase64: inlinePart.inlineData.data })
  } catch (e: any) {
    console.error('Exception calling Gemini:', e)
    res.status(500).json({ error: 'Internal error', details: e.toString() })
  }
}


Notes:

You may choose to return a binary image (Buffer) or directly base64 in JSON.

If returning binary, set proper Content-Type, and perhaps convert base64 to buffer.

Always validate input (prompt length, allowed characters, image size) before sending to Gemini.

B. Client-side / Fetch from Frontend

On the client side, you would call your API route:

async function generateImage(prompt: string, imageBase64?: string, mimeType?: string): Promise<string> {
  const resp = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageBase64, mimeType })
  })
  const j = await resp.json()
  if (!resp.ok) {
    throw new Error(j.error ?? 'Unknown error')
  }
  return j.imageBase64  // base64 string of the generated image
}


Then you can set an <img src={data:image/png;base64,${imageBase64}} /> or convert to Blob and show.

C. Edge / Middleware Considerations

In Next.js Edge functions or Vercel Edge, you can use fetch, but ensure your environment supports larger payloads (base64 images may be heavy).

Keep API key secret — do not embed it in client code.

Be mindful of cold starts or timeouts: image generation may take time.

5. Response Parsing & Decoding

The Gemini API response JSON contains a candidates array. 
Google AI for Developers

Typically you take the first candidate: candidates[0].content.parts. 
Google AI for Developers

Each part may be either a text part or an inlineData part. The inlineData part holds the image data in base64. 
Google AI for Developers

You should filter for part.inlineData to get the base64 data.

Convert base64 to binary or Blob as needed in your stack (browser / Node).

Example (client-side):

const base64 = inlinePart.inlineData.data
const byteCharacters = atob(base64)
const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0))
const byteArray = new Uint8Array(byteNumbers)
const blob = new Blob([ byteArray ], { type: inlinePart.inlineData.mimeType })
const url = URL.createObjectURL(blob)
// set <img src={url} />


Alternatively, directly embed via data: URL:
src="data:image/png;base64,${base64}"

6. Error Handling & Retries

If the API returns non-2xx status, inspect the response body (often error JSON).

Add retries with exponential backoff for transient failures (e.g. HTTP 429 or 503).

Ensure timeouts: do not wait indefinitely.

Validate that candidates exist and include inlineData.

Log full error details (while masking sensitive info) for debugging.

7. Prompt Strategies & Best Practices

From the official doc:

Describe the scene, don’t just list keywords. Narrative-style prompts yield better coherency. 
Google AI for Developers

For photorealistic images, include camera details (lens, angles), lighting, textures, depth, mood, aspect ratio. 
Google AI for Developers

For illustrations / stylized assets, specify style (e.g. “kawaii”, “line art”, “transparent background”). 
Google AI for Developers

To render text in images, explicitly describe the text content, font style (sans serif, bold), placement, colors. 
Google AI for Developers

Use inpainting / masking via prompts that preserve the rest of the image while altering a part. 
Google AI for Developers

Iterative prompting: generate, review, then ask incremental edits (e.g. “Change the color of the car to yellow”) over multiple calls. 
Google AI for Developers

Some prompt templates (from doc):

Photorealistic:

"A photorealistic close-up portrait … with soft golden hour light … captured with 85mm lens … blurred background" 
Google AI for Developers

Sticker / illustration:

"A kawaii-style sticker of a happy red panda … bold outlines … transparent background" 
Google AI for Developers

Editing:

"Using the provided image of my cat, please add a small, knitted wizard hat on its head … matching lighting" 
Google AI for Developers

8. Security / Usage & Operational Considerations

Never expose your API key in client-side or public code. Always route requests via trusted backend.

Rate limits and quotas: check your Google / Gemini API quota; plan for burst limits.

Payload size: large base64 images increase payload; limit image size/resolution for editing.

Watermark / attribution: Gemini attaches a watermark (SynthID) to images by default. 
Google AI for Developers

Usage policies: do not generate copyrighted, harassing, or disallowed content. Gemini’s usage is subject to Google’s policies. 
Google AI for Developers

Caching: if you generate images deterministically (same prompt), consider caching results.

Timeouts & performance: image generation may take more time than text generation; set appropriate timeouts and show progress/spinners in UI.

9. Example: Full Next.js Flow

Here is a full minimal example combining API route + client component.

app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash-image'

export async function POST(req: NextRequest) {
  const { prompt, imageBase64, mimeType } = await req.json()

  const parts: any[] = []
  parts.push({ text: prompt })
  if (imageBase64 && mimeType) {
    parts.push({
      inlineData: { mimeType, data: imageBase64 }
    })
  }
  const body = { contents: [ { parts } ] }

  const apiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY ?? ''
      },
      body: JSON.stringify(body)
    }
  )

  if (!apiRes.ok) {
    const errText = await apiRes.text()
    return NextResponse.json({ error: 'Failed', details: errText }, { status: 500 })
  }

  const data = await apiRes.json()
  const candidates = data.candidates
  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ error: 'No candidates' }, { status: 500 })
  }
  const inline = candidates[0].content.parts.find((p: any) => p.inlineData)
  if (!inline) {
    return NextResponse.json({ error: 'No image data' }, { status: 500 })
  }
  return NextResponse.json({ imageBase64: inline.inlineData.data })
}

Client component (e.g. app/page.tsx)
'use client'
import { useState } from 'react'

export default function Page() {
  const [prompt, setPrompt] = useState('')
  const [imgBase64, setImgBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const j = await resp.json()
      if (!resp.ok) {
        throw new Error(j.error ?? 'Gen failed')
      }
      setImgBase64(j.imageBase64)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Gemini Image Generator</h1>
      <textarea
        rows={4}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Describe the image you want"
      />
      <button onClick={handleGenerate} disabled={loading || !prompt}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imgBase64 && (
        <img
          src={`data:image/png;base64,${imgBase64}`}
          alt="generated"
          style={{ maxWidth: '100%', marginTop: '16px' }}
        />
      )}
    </div>
  )
}


This minimal flow keeps your API key safe on the server, handles prompt submission, and displays the resulting image.

You can extend this by:

Supporting image upload & inline editing

Supporting multiple images input

Supporting progressive refinement / multi-turn edits

Adding UI for loading states, error feedback, retries

10. Summary & Developer Checklist
Step	Description
✅ Get API key & access	Ensure you have valid Gemini / Google credentials
✅ Choose model	e.g. gemini-2.5-flash-image
✅ Build request payload	Use contents with text and optional inlineData
✅ Use server-side / secure API route	Never expose the key in client code
✅ Call fetch to Gemini endpoint	With proper headers including x-goog-api-key
✅ Parse response	Extract candidates[0].content.parts and find inlineData
✅ Return image to client	Base64 or Blob / binary
✅ On client, render image	Use data: URL or Blob URL
✅ Handle errors & retries	429, 500, timeouts etc.
✅ Craft good prompts	Narrative style, mention lighting, style, text, etc.
✅ Respect usage policies & quotas	Avoid disallowed content, monitor usage