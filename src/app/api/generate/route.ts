import { NextResponse } from "next/server";
import Jimp from "jimp";
import { File } from "@web-std/file";
import fs from "node:fs";

function fileToBuffer(file) {
  const buffer = fs.readFileSync(file.path);
  return buffer;
}

export async function POST(req: Request) {
  const receivedformData = await req.formData();
  console.log(receivedformData.get("image"));

  // Resize image dimensions to be a multiple of 64
  // and reduce the size of the image to a maximum of 512x512
  // First save image to disk and then read it with Jimp
  // Then delete the image from disk

  const imageBase64 = receivedformData.get("image");

  // const imageBuffer = fileToBuffer(receivedformData.get("image"));
  const imageBuffer = Buffer.from(imageBase64 as any, "base64");
  fs.writeFileSync("./public/input/image.png", imageBuffer);

  const image = await Jimp.read("./public/input/image.png");
  const width = image.getWidth();
  const height = image.getHeight();
  const newWidth = Math.min(Math.ceil(width / 64) * 64, 512);
  const newHeight = Math.min(Math.ceil(height / 64) * 64, 512);
  image.resize(newWidth, newHeight);

  await image.writeAsync("./public/input/image.png");

  // imageToStability is in the form of a File object of type image/png
  const imageToStabilityBuffer = fs.readFileSync("./public/input/image.png");
  const imageToStability = new File([imageToStabilityBuffer], "image.png", {
    type: "image/png",
  });
  // const imageToStability = fs.readFileSync("./public/input/image.png");

  fs.unlinkSync("./public/input/image.png");

  // const image = await Jimp.read(receivedformData.get("image") as Buffer);
  // const width = image.getWidth();
  // const height = image.getHeight();
  // const newWidth = Math.ceil(width / 64) * 64;
  // const newHeight = Math.ceil(height / 64) * 64;
  // image.resize(newWidth, newHeight);

  const engineId = "stable-diffusion-v1-5";
  const apiHost = receivedformData.get("apiHost") ?? "https://api.stability.ai";
  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) throw new Error("Missing Stability API key.");

  const formData = new FormData();

  formData.append("init_image", imageToStability as Blob);
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
