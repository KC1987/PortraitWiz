import { mapGeminiError } from "@/lib/error-messages";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GenerateImageParams {
  prompt: string;
  imageBase64Array?: string[];
}

interface GenerateImageResponse {
  imageBase64: string;
}

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiError extends Error {
  suggestion?: string;
  isRetryable?: boolean;
}

export async function generateImage({
  prompt,
  imageBase64Array,
}: GenerateImageParams): Promise<GenerateImageResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  // Build contents array
  const parts: GeminiPart[] = [{ text: prompt }];

  // Add optional images for editing/composition (up to 4 reference images)
  if (imageBase64Array && imageBase64Array.length > 0) {
    imageBase64Array.forEach((imageBase64) => {
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: imageBase64,
        },
      });
    });
  }

  const body = {
    contents: [{ parts }],
  };

  // Call Gemini API
  const resp = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    // Map technical error to user-friendly message
    const friendlyError = mapGeminiError(errorText);
    const error: GeminiError = new Error(friendlyError.message);
    error.suggestion = friendlyError.suggestion;
    error.isRetryable = friendlyError.isRetryable;
    throw error;
  }

  const data = await resp.json();

  // Extract inline image data from response
  const candidate = data.candidates?.[0];
  const responseParts: GeminiPart[] = candidate?.content?.parts || [];
  const inline = responseParts.find((p) => p.inlineData);

  if (!inline || !inline.inlineData) {
    const friendlyError = mapGeminiError("No image returned from Gemini");
    const error: GeminiError = new Error(friendlyError.message);
    error.suggestion = friendlyError.suggestion;
    error.isRetryable = friendlyError.isRetryable;
    throw error;
  }

  return {
    imageBase64: inline.inlineData.data,
  };
}