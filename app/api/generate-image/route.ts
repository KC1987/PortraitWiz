import { NextResponse } from "next/server";
import {
  generateImage,
  IMAGE_PROVIDERS,
  type ImageProvider,
} from "../calls/image-gen";
import { createClient } from "@/utils/supabase/server";
import { mapAuthError, mapCreditsError } from "@/lib/error-messages";

interface GeminiError extends Error {
  suggestion?: string;
  isRetryable?: boolean;
}

export async function POST(req: Request) {

  try {
    const {
      prompt,
      imageBase64Array,
      provider,
      size,
      quality,
    } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Validate image array (max 4 images)
    if (imageBase64Array && imageBase64Array.length > 4) {
      return NextResponse.json({ error: "Maximum 4 reference images allowed" }, { status: 400 });
    }

    let normalizedProvider: ImageProvider | undefined;

    if (provider !== undefined) {
      const providerString = provider.toString().toLowerCase();
      if (IMAGE_PROVIDERS.includes(providerString as ImageProvider)) {
        normalizedProvider = providerString as ImageProvider;
      } else {
        return NextResponse.json(
          { error: "Invalid provider option supplied" },
          { status: 400 },
        );
      }
    }

    const sizeOption = typeof size === "string" ? size : undefined;
    const qualityOption = typeof quality === "string" ? quality : undefined;
    const allowedSizes = ["256x256", "512x512", "1024x1024"] as const;
    const allowedQualities = ["standard", "high"] as const;

    if (
      sizeOption &&
      !allowedSizes.includes(sizeOption as (typeof allowedSizes)[number])
    ) {
      return NextResponse.json(
        { error: "Invalid size option supplied" },
        { status: 400 },
      );
    }

    if (
      qualityOption &&
      !allowedQualities.includes(
        qualityOption as (typeof allowedQualities)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Invalid quality option supplied" },
        { status: 400 },
      );
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
      imageBase64Array,
      provider: normalizedProvider,
      size: sizeOption as (typeof allowedSizes)[number] | undefined,
      quality: qualityOption as (typeof allowedQualities)[number] | undefined,
    });


    // Deduct credits, return image and new credits amount
    if (image_data) {
      const { data: credits_data, error: credits_error } = await supabase.rpc("deduct_credits", { user_id: user.id, amount: "1" });

      if (credits_error) {
        console.error(credits_error);
      }

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
