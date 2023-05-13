import { NextResponse } from "next/server";
import fs from "node:fs";

export async function POST(req: Request) {
  const receivedformData = await req.formData();
  console.log(receivedformData.get("image"));

  const engineId = "stable-diffusion-v1-5";
  const apiHost = receivedformData.get("apiHost") ?? "https://api.stability.ai";
  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) throw new Error("Missing Stability API key.");

  const formData = new FormData();

  formData.append("init_image", receivedformData.get("image") as Blob);
  formData.append("init_image_mode", "IMAGE_STRENGTH");
  formData.append("image_strength", receivedformData.get("strength") as string);
  formData.append(
    "text_prompts[0][text]",
    receivedformData.get("prompt") as string
  );
  formData.append("cfg_scale", "7");
  formData.append("clip_guidance_preset", "FAST_BLUE");
  formData.append("samples", "1");
  formData.append("steps", "30");

  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/image-to-image`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string;
      seed: number;
      finishReason: string;
    }>;
  }

  const responseJSON = (await response.json()) as GenerationResponse;

  let promptWords = receivedformData.get("prompt")?.toString().split(" ");

  let imageName = promptWords?.join("_") + ".png";
  responseJSON.artifacts.forEach((image, index) => {
    fs.writeFileSync(
      `./public/generated/${imageName}`,
      Buffer.from(image.base64, "base64")
    );
  });

  return NextResponse.json(imageName);
}
