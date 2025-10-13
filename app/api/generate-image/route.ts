import { NextResponse } from "next/server";
import { generateImage } from "../calls/image-gen";
import { createClient } from "@/utils/supabase/server";
import { mapAuthError, mapCreditsError } from "@/lib/error-messages";


export async function POST(req: Request) {

  try {
    const { prompt, imageBase64Array } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Validate image array (max 4 images)
    if (imageBase64Array && imageBase64Array.length > 4) {
      return NextResponse.json({ error: "Maximum 4 reference images allowed" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      const friendlyError = mapAuthError("Unauthorized");
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
    const image_data = await generateImage({ prompt, imageBase64Array });


    // Deduct credits, return image and new credits amount
    if (image_data) {
      const { data: credits_data, error: credits_error } = await supabase.rpc("deduct_credits", { user_id: user.id, amount: "1" });

      credits_error && console.error(credits_error);

      return NextResponse.json({ image_data, credits_data });
    }


    // Error
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong while creating your portrait.";
    const suggestion = (err as any)?.suggestion || "Please try again in a moment.";
    const isRetryable = (err as any)?.isRetryable ?? true;

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
