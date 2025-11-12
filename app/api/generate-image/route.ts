import { NextResponse } from "next/server";
import { generateImage } from "../calls/image-gen";
import { createClient } from "@/utils/supabase/server";
import { mapAuthError, mapCreditsError } from "@/lib/error-messages";
import { decode } from 'base64-arraybuffer';
import { v4 as uuid } from "uuid";

interface GeminiError extends Error {
  suggestion?: string;
  isRetryable?: boolean;
}

type ReferenceImagePayload = {
  data: string;
  mimeType?: string;
};

const MAX_REFERENCE_IMAGES = 4;
const MAX_REFERENCE_BYTES = 1024 * 1024; // 1MB

export const maxRequestBodySize = "16mb";

export async function POST(req: Request) {

  try {
    const {
      prompt,
      imageBase64Array,
    } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Validate image array (max 4 images)
    const referenceImages = Array.isArray(imageBase64Array)
      ? (imageBase64Array as ReferenceImagePayload[])
      : undefined;

    if (referenceImages && referenceImages.length > MAX_REFERENCE_IMAGES) {
      return NextResponse.json({ error: "Maximum 4 reference images allowed" }, { status: 400 });
    }

    if (referenceImages) {
      for (const image of referenceImages) {
        if (!image || typeof image.data !== "string" || image.data.trim().length === 0) {
          return NextResponse.json({ error: "Invalid image payload supplied" }, { status: 400 });
        }

        const approxBytes = Math.floor((image.data.length * 3) / 4);
        if (approxBytes > MAX_REFERENCE_BYTES) {
          return NextResponse.json(
            { error: "Each reference image must be under 1MB" },
            { status: 413 },
          );
        }
      }
    }

    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      const friendlyError = mapAuthError();
      return NextResponse.json(
        {
          error: friendlyError.message,
          suggestion: friendlyError.suggestion,
          isRetryable: friendlyError.isRetryable
        },
        { status: 401 }
      );
    }

    // Check if user has sufficient credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
    }

    if (profile.credits < 1) {
      const friendlyError = mapCreditsError();
      return NextResponse.json(
        {
          error: friendlyError.message,
          suggestion: friendlyError.suggestion,
          isRetryable: friendlyError.isRetryable
        },
        { status: 402 }
      );
    }

    // Generate the image
    const image_data = await generateImage({
      prompt,
      imageBase64Array: referenceImages?.map((image) => ({
        data: image.data,
        mimeType: image.mimeType ?? "image/jpeg",
      })),
    });


    // Deduct credits, store, return image and new credits amount
    if (image_data) {
      // Deduct credits
      const { data: credits_data, error: credits_error } = await supabase.rpc("deduct_credits", { user_id: user.id, amount: "1" });

      if (credits_error) {
        console.error(credits_error);
      }

      // Resize image



      // Store image
      // Clean base64 string (remove data URL prefix if present)
      const base64Clean = image_data.imageBase64.replace(/^data:image\/\w+;base64,/, '');

      // Generate meaningful filename with timestamp + uuid
      const filename = `generated_${Date.now()}_${uuid()}.png`;
      const filePath = `${user.id}/${filename}`;

      const { data: storage_data, error: storage_error } = await supabase.storage
        .from("user-images")
        .upload(filePath, decode(base64Clean), {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false // Prevent accidental overwrites
        });

      if (storage_error) {
        console.error('Storage upload failed:', storage_error);
        return Response.json(
          { error: 'Failed to store image', details: storage_error.message },
          { status: 500 }
        );
      }

      storage_data && console.log("Storage response: ", storage_data);

      return NextResponse.json({ image_data, credits_data });
    }


    // Error
  } catch (err: unknown) {
    const geminiError = err as GeminiError;
    const message = err instanceof Error ? err.message : "Something went wrong while creating your portrait.";
    const suggestion = geminiError?.suggestion || "Please try again in a moment.";
    const isRetryable = geminiError?.isRetryable ?? true;

    return NextResponse.json(
      {
        error: message,
        suggestion,
        isRetryable
      },
      { status: 500 }
    );
  }
}
