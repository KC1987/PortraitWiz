import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// import { trainLora } from "../calls/lora-training";
// import { mapAuthError } from "@/lib/error-messages";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Handle authentication errors


    // Parse request body
    const body = await req.json();
    const {
      zipUrl,
      modelName,
      triggerWord,
      steps,
      learningRate,
      autocaption,
      captionPrefix,
    } = body;

    // Validate required fields
    if (!zipUrl || !modelName) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          suggestion: "Please provide both zipUrl and modelName.",
        },
        { status: 400 }
      );
    }

    // Train the LoRA model
    const result = await trainLora({
      zipUrl,
      modelName,
      triggerWord,
      steps,
      learningRate,
      autocaption,
      captionPrefix,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      trainingId: result.trainingId,
      status: result.status,
      modelDestination: result.modelDestination,
      message: "LoRA training started successfully",
    });
  } catch (error: any) {
    console.error("LoRA training API error:", error);

    const statusCode = error.isRetryable === false ? 400 : 500;

    return NextResponse.json(
      {
        error: error.message || "Training failed",
        suggestion: error.suggestion || "Please try again later.",
        isRetryable: error.isRetryable ?? true,
      },
      { status: statusCode }
    );
  }
}

