import { NextResponse } from "next/server";
import Replicate from "replicate";

const img_url = "https://enzwafcndzopdhqcddpr.supabase.co/storage/v1/object/sign/loras/eo.zip?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zYjVkYTc1MC03YmQ0LTQ2ZDktYTM1NS02YzdmYjU2OWM4MjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb3Jhcy9lby56aXAiLCJpYXQiOjE3NjQ0OTM0MDIsImV4cCI6MTc5NjAyOTQwMn0.XmIkm02FybPwydS7vKhPmb4aWiQeAeo7aLjEW5kBGfM";



export async function POST(req: Request) {

  // Dynamically build webhook URL based on the current request
  // const url = new URL(req.url);
  // const baseUrl = `${url.protocol}//${url.host}`;
  const webhook_url = "https://portraitwiz.com/api/webhooks/lora-training";


  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Model name is required" },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Step 1: Create the model
    const endpoint = "https://api.replicate.com/v1/models";
    const reqBody = {
      owner: "portraitwiz",
      name: name,
      description: "Custom trained model",
      visibility: "private",
      hardware: "gpu-h100",
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to create model" },
        { status: response.status }
      );
    }

    const modelData = await response.json();

    // Step 2: Create LORA training
    const training = await replicate.trainings.create(
      "replicate",
      "fast-flux-trainer",
      "f463fbfc97389e10a2f443a8a84b6953b1058eafbf0c9af4d84457ff07cb04db",
      {
        destination: `portraitwiz/${name}`,
        input: {
          input_images: img_url,
          trigger_word: name,
          training_steps: 1000,
        },
        webhook: webhook_url,
      }
    );

    // 3: Webhook after training completes
    // 4: Generate images

    // Return both the model and training info
    return NextResponse.json({
      model: modelData,
      training: {
        id: training.id,
        status: training.status,
        urls: training.urls,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
}