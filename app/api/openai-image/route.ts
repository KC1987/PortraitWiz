import { NextResponse } from "next/server";
import { generateOpenAIImage } from "../calls/openai-image";
import { createClient } from "@/utils/supabase/server";
import {
  mapAuthError,
  mapCreditsError,
} from "@/lib/error-messages";

interface OpenAIError extends Error {
  suggestion?: string;
  isRetryable?: boolean;
}

type ImageSize = "256x256" | "512x512" | "1024x1024";
type ImageQuality = "standard" | "high";

const ALLOWED_SIZES: ImageSize[] = ["256x256", "512x512", "1024x1024"];
const ALLOWED_QUALITIES: ImageQuality[] = ["standard", "high"];

export async function POST(req: Request) {
  try {
    const {
      prompt,
      imageBase64Array,
      size = "1024x1024",
      quality = "standard",
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 },
      );
    }

    if (!ALLOWED_SIZES.includes(size)) {
      return NextResponse.json(
        { error: "Invalid size option supplied" },
        { status: 400 },
      );
    }

    if (!ALLOWED_QUALITIES.includes(quality)) {
      return NextResponse.json(
        { error: "Invalid quality option supplied" },
        { status: 400 },
      );
    }

    if (imageBase64Array && imageBase64Array.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 reference images allowed" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const friendlyError = mapAuthError();
      return NextResponse.json(
        {
          error: friendlyError.message,
          suggestion: friendlyError.suggestion,
          isRetryable: friendlyError.isRetryable,
        },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 },
      );
    }

    if (profile.credits < 1) {
      const friendlyError = mapCreditsError();
      return NextResponse.json(
        {
          error: friendlyError.message,
          suggestion: friendlyError.suggestion,
          isRetryable: friendlyError.isRetryable,
        },
        { status: 402 },
      );
    }

    const imageData = await generateOpenAIImage({
      prompt,
      size,
      quality,
      imageBase64Array,
    });

    const { data: creditsData, error: creditsError } = await supabase.rpc(
      "deduct_credits",
      { user_id: user.id, amount: "1" },
    );

    if (creditsError) {
      console.error(creditsError);
    }

    return NextResponse.json({
      image_data: imageData,
      credits_data: creditsData,
    });
  } catch (err: unknown) {
    const openaiError = err as OpenAIError;
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong while creating your portrait.";
    const suggestion =
      openaiError?.suggestion || "Please try again in a moment.";
    const isRetryable = openaiError?.isRetryable ?? true;

    return NextResponse.json(
      {
        error: message,
        suggestion,
        isRetryable,
      },
      { status: 500 },
    );
  }
}
