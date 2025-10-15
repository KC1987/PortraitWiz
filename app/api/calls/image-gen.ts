import { mapGeminiError } from "@/lib/error-messages";
import { generateOpenAIImage } from "./openai-image";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const IMAGE_PROVIDERS = ["openai", "gemini"] as const;
export type ImageProvider = (typeof IMAGE_PROVIDERS)[number];

const DEFAULT_PROVIDER =
  normalizeProvider(process.env.IMAGE_GENERATION_PROVIDER) ?? "openai";

interface GenerateImageParams {
  prompt: string;
  imageBase64Array?: string[];
  size?: "256x256" | "512x512" | "1024x1024";
  quality?: "standard" | "high";
  provider?: ImageProvider;
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

export async function generateGeminiImage({
  prompt,
  imageBase64Array,
}: GenerateImageParams): Promise<GenerateImageResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  const parts: GeminiPart[] = [{ text: prompt }];

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
    const friendlyError = mapGeminiError(errorText);
    const error: GeminiError = new Error(friendlyError.message);
    error.suggestion = friendlyError.suggestion;
    error.isRetryable = friendlyError.isRetryable;
    throw error;
  }

  const data = await resp.json();

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

export async function generateImage(
  params: GenerateImageParams,
): Promise<GenerateImageResponse> {
  const provider = resolveProvider(params.provider, params.imageBase64Array);

  if (provider === "gemini") {
    return generateGeminiImage(params);
  }

  return generateOpenAIImage({
    prompt: params.prompt,
    size: params.size,
    quality: params.quality,
  });
}

function resolveProvider(
  requested: ImageProvider | undefined,
  imageBase64Array: string[] | undefined,
): ImageProvider {
  const normalizedRequested = normalizeProvider(requested);
  const baseProvider = normalizedRequested ?? DEFAULT_PROVIDER;

  if (baseProvider === "openai" && imageBase64Array && imageBase64Array.length) {
    return "gemini";
  }

  return baseProvider;
}

function normalizeProvider(
  value: string | ImageProvider | undefined,
): ImageProvider | undefined {
  if (!value) {
    return undefined;
  }

  const lower = value.toString().toLowerCase();
  return IMAGE_PROVIDERS.find((provider) => provider === lower) as
    | ImageProvider
    | undefined;
}
