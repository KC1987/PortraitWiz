import { mapOpenAIError } from "@/lib/error-messages";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-image-1";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/images";

interface GenerateOpenAIImageParams {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
  quality?: "standard" | "high";
  imageBase64Array?: string[];
}

interface GenerateImageResponse {
  imageBase64: string;
}

interface OpenAIError extends Error {
  suggestion?: string;
  isRetryable?: boolean;
}

export async function generateOpenAIImage({
  prompt,
  size = "1024x1024",
  quality = "standard",
  imageBase64Array,
}: GenerateOpenAIImageParams): Promise<GenerateImageResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable not set");
  }

  if (imageBase64Array && imageBase64Array.length > 0) {
    const error: OpenAIError = new Error(
      "Reference images are not yet supported for OpenAI generation",
    );
    error.suggestion =
      "Remove the reference images and try again while we add this capability.";
    error.isRetryable = false;
    throw error;
  }

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        prompt,
        size,
        quality,
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const friendlyError = mapOpenAIError(errorText);
      const error: OpenAIError = new Error(friendlyError.message);
      error.suggestion = friendlyError.suggestion;
      error.isRetryable = friendlyError.isRetryable;
      throw error;
    }

    const data = await response.json();

    // Temporary log for QA: surface minimal metadata without dumping full base64
    const preview =
      typeof data?.data?.[0]?.b64_json === "string"
        ? data.data[0].b64_json.slice(0, 16)
        : null;
    console.log("[OpenAI:gpt-image-1] response", {
      size,
      quality,
      created: data?.created,
      outputs: Array.isArray(data?.data) ? data.data.length : 0,
      preview,
    });
    const image = data.data?.[0];

    if (!image?.b64_json) {
      const error: OpenAIError = new Error("No image returned from OpenAI");
      error.suggestion = "Try a different prompt.";
      error.isRetryable = true;
      throw error;
    }

    return {
      imageBase64: image.b64_json,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const friendlyError = mapOpenAIError(message);
    const error: OpenAIError = new Error(friendlyError.message);
    error.suggestion = friendlyError.suggestion;
    error.isRetryable = friendlyError.isRetryable;
    throw error;
  }
}
