import fs from "node:fs";

export async function POST(req: Request) {
  const receivedformData = await req.formData();
  console.log(receivedformData.get("image"));

  const engineId = "stable-diffusion-v1-5";
  const apiHost = receivedformData.get("apiHost") ?? "https://api.stability.ai";
  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) throw new Error("Missing Stability API key.");

  const formData = new FormData();

  // NOTE: This example is using a NodeJS FormData library.
  // Browsers should use their native FormData class.
  // React Native apps should also use their native FormData class.
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

  console.log(formData);

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

  console.log(responseJSON);

  responseJSON.artifacts.forEach((image, index) => {
    fs.writeFileSync(
      `v1_img2img_${index}.png`,
      Buffer.from(image.base64, "base64")
    );
  });

  return new Response("OK");
}
