import { Runware } from "@runware/sdk-js";
import { mapRunwareError } from "@/lib/error-messages";

const RUNWARE_API_KEY = process.env.RUNWARE_API_KEY;

interface ReferenceImage {
  data: string;
  mimeType: string;
}

interface GeneratePhotoMakerParams {
  prompt: string;
  imageBase64Array?: ReferenceImage[];
}

interface GeneratePhotoMakerResponse {
  imageBase64: string;
}

interface RunwareError extends Error {
  suggestion?: string;
  isRetryable?: boolean;
}

/**
 * Generates a portrait image using PhotoMaker-V2 via Runware API
 *
 * @param prompt - The generation prompt (trigger word "rwre" will be auto-prepended if missing)
 * @param imageBase64Array - Optional array of 1-4 reference images (base64)
 * @returns Promise with base64 encoded image data
 * @throws RunwareError with user-friendly message and suggestions
 */
export async function generatePhotoMakerImage({
  prompt,
  imageBase64Array,
}: GeneratePhotoMakerParams): Promise<GeneratePhotoMakerResponse> {
  if (!RUNWARE_API_KEY) {
    throw new Error("RUNWARE_API_KEY environment variable not set");
  }

  // Ensure prompt includes the trigger word "rwre"
  // Insert near subject descriptor for better PhotoMaker results
  let enhancedPrompt = prompt;

  if (!prompt.toLowerCase().includes("rwre")) {
    // Try to insert after common portrait phrases for better positioning
    const insertionPatterns = [
      /portrait photograph of a/i,
      /portrait of a/i,
      /headshot of a/i,
      /photo of a/i,
      /portrait photograph of/i,
      /portrait of/i,
      /headshot of/i,
      /photo of/i,
    ];

    let inserted = false;
    for (const pattern of insertionPatterns) {
      if (pattern.test(prompt)) {
        enhancedPrompt = prompt.replace(pattern, (match) => `${match} rwre`);
        inserted = true;
        break;
      }
    }

    // Fallback: prepend if no good insertion point found
    if (!inserted) {
      enhancedPrompt = `rwre ${prompt}`;
    }
  }

  // Initialize Runware SDK
  const runware = new Runware({ apiKey: RUNWARE_API_KEY });

  try {
    // Connect to Runware WebSocket
    console.log('[PhotoMaker Helper] Connecting to Runware...');
    await runware.connect();
    console.log('[PhotoMaker Helper] Connected successfully');

    // Convert base64 images to data URIs for Runware
    const inputImages = imageBase64Array?.map((image) => {
      // Check if already has data URI prefix
      const hasPrefix = image.data.startsWith("data:");
      if (hasPrefix) {
        return image.data;
      }
      // Add data URI prefix
      return `data:${image.mimeType};base64,${image.data}`;
    });

    console.log('[PhotoMaker Helper] Input images count:', inputImages?.length || 0);
    console.log('[PhotoMaker Helper] Enhanced prompt:', enhancedPrompt.substring(0, 100) + '...');

    // Generate image using PhotoMaker
    console.log('[PhotoMaker Helper] Calling Runware photoMaker...');

    let partialImages: any[] = [];
    let partialError: any = null;

    const result = await runware.photoMaker({
      positivePrompt: enhancedPrompt,
      negativePrompt: "(asymmetry, worst quality, low quality, illustration, 3d, 2d, painting, cartoons, sketch), open mouth, grayscale",
      inputImages: inputImages || [],
      model: "civitai:139562@344487" as any, // PhotoMaker model AIR identifier
      style: "Photographic" as any, // EPhotoMakerEnum.Photographic
      strength: 30,
      width: 1024,
      height: 1024,
      steps: 30,
      numberResults: 1,
      outputFormat: "PNG",
      CFGScale: 7.5,
      includeCost: true,
      customTaskUUID: crypto.randomUUID(),
      onPartialImages: (images, error) => {
        console.log('[PhotoMaker Helper] onPartialImages callback triggered');
        console.log('[PhotoMaker Helper] Partial images:', images);
        console.log('[PhotoMaker Helper] Partial error:', error);
        if (error) {
          partialError = error;
        } else {
          partialImages = images;
        }
      }
    });

    console.log('[PhotoMaker Helper] Partial images collected:', partialImages.length);
    console.log('[PhotoMaker Helper] Partial error:', partialError);

    console.log('[PhotoMaker Helper] PhotoMaker call completed');
    console.log('[PhotoMaker Helper] Result type:', typeof result);
    console.log('[PhotoMaker Helper] Result is array:', Array.isArray(result));
    console.log('[PhotoMaker Helper] Result length:', Array.isArray(result) ? result.length : 'N/A');

    // Check for partial error first
    if (partialError) {
      console.error('[PhotoMaker Helper] Error from onPartialImages:', partialError);
      throw new Error(`PhotoMaker error: ${partialError.message || JSON.stringify(partialError)}`);
    }

    // Use result or fall back to partialImages
    let finalResult = result;
    if ((!result || !Array.isArray(result) || result.length === 0) && partialImages.length > 0) {
      console.log('[PhotoMaker Helper] Using partial images as result');
      finalResult = partialImages;
    }

    // Extract image data
    if (!finalResult || !Array.isArray(finalResult) || finalResult.length === 0) {
      const friendlyError = mapRunwareError("No image returned from PhotoMaker");
      const error: RunwareError = new Error(friendlyError.message);
      error.suggestion = friendlyError.suggestion;
      error.isRetryable = friendlyError.isRetryable;
      throw error;
    }

    const imageData = finalResult[0];

    console.log('[PhotoMaker Helper] Image data:', imageData);

    // Runware SDK returns imageURL, not base64 - we need to fetch it
    if (!imageData.imageURL) {
      console.error('[PhotoMaker Helper] No imageURL in result:', imageData);
      throw new Error("No image URL returned from PhotoMaker");
    }

    console.log('[PhotoMaker Helper] Fetching image from URL:', imageData.imageURL);

    // Fetch the image from the URL and convert to base64
    const imageResponse = await fetch(imageData.imageURL);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    console.log('[PhotoMaker Helper] Image fetched, base64 length:', imageBase64.length);

    return {
      imageBase64,
    };
  } catch (err: unknown) {
    console.error('[PhotoMaker Helper] Original error:', err);
    console.error('[PhotoMaker Helper] Error type:', typeof err);
    console.error('[PhotoMaker Helper] Error details:', JSON.stringify(err, null, 2));

    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[PhotoMaker Helper] Error message:', errorMessage);

    const friendlyError = mapRunwareError(errorMessage);
    const error: RunwareError = new Error(friendlyError.message);
    error.suggestion = friendlyError.suggestion;
    error.isRetryable = friendlyError.isRetryable;
    throw error;
  } finally {
    // Always disconnect from WebSocket, even on error
    try {
      await runware.disconnect();
    } catch (disconnectError) {
      // Log but don't throw - we don't want to mask the original error
      console.error("Failed to disconnect from Runware:", disconnectError);
    }
  }
}
