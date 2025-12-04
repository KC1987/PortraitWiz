import { NextResponse } from "next/server";
import { generatePhotoMakerImage } from "../calls/photomaker-gen";
import { createClient } from "@/utils/supabase/server";
import { mapAuthError, mapCreditsError } from "@/lib/error-messages";
import { decode } from 'base64-arraybuffer';
import { v4 as uuid } from "uuid";

interface PhotoMakerError extends Error {
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
  console.log('[PhotoMaker] Request received');

  try {
    const {
      prompt,
      imageBase64Array,
    } = await req.json();

    console.log('[PhotoMaker] Prompt length:', prompt?.length);
    console.log('[PhotoMaker] Images count:', imageBase64Array?.length || 0);

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

    // Generate the image using PhotoMaker-V2
    const image_data = await generatePhotoMakerImage({
      prompt,
      imageBase64Array: referenceImages?.map((image) => ({
        data: image.data,
        mimeType: image.mimeType ?? "image/jpeg",
      })),
    });

    // Store image BEFORE deducting credits (so user doesn't lose credits if storage fails)
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
      return NextResponse.json(
        {
          error: 'Failed to store image',
          suggestion: 'Please try again. Your credits have not been deducted.',
          isRetryable: true
        },
        { status: 500 }
      );
    }

    storage_data && console.log("Storage response: ", storage_data);

    // Deduct credits only after successful generation AND storage
    const { data: credits_data, error: credits_error } = await supabase.rpc("deduct_credits", {
      user_id: user.id,
      amount: 1  // Fixed: Use number instead of string
    });

    if (credits_error) {
      console.error('Credit deduction failed:', credits_error);
      return NextResponse.json(
        {
          error: 'Failed to process payment',
          suggestion: 'Please contact support. Your image was generated but credits could not be deducted.',
          isRetryable: false
        },
        { status: 500 }
      );
    }

    // Validate credits_data before returning
    if (credits_data === null || credits_data === undefined) {
      console.error('Credit deduction returned null/undefined');
      return NextResponse.json(
        {
          error: 'Failed to update credit balance',
          suggestion: 'Please contact support.',
          isRetryable: false
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ image_data, credits_data });


    // Error
  } catch (err: unknown) {
    console.error('[PhotoMaker] Error caught:', err);
    console.error('[PhotoMaker] Error stack:', err instanceof Error ? err.stack : 'No stack');

    const photoMakerError = err as PhotoMakerError;
    const message = err instanceof Error ? err.message : "Something went wrong while creating your portrait.";
    const suggestion = photoMakerError?.suggestion || "Please try again in a moment.";
    const isRetryable = photoMakerError?.isRetryable ?? true;

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
