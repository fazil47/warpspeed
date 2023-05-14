"use client";
import { useState, FormEvent } from "react";
import styles from "./page.module.css";
import SceneEditor from "@/components/SceneEditor";
import Image from "next/image";

export default function Editor() {
  const [image, setImage] = useState<File>();
  const [prompt, setPrompt] = useState<string>("");
  const [strength, setStrength] = useState<number>(0.3);
  const [outputImageURL, setOutputImageURL] = useState<string>("");

  async function generateImage(image: any, prompt: string, strength: number) {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("prompt", prompt);
    formData.append("strength", strength.toString());
    formData.append("apiHost", "https://api.stability.ai");

    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    const imageStream = await response.body;

    console.log(imageStream);

    if (imageStream) {
      // readable stream to character string
      const reader = imageStream.getReader();
      const decoder = new TextDecoder("utf-8");
      const { value } = await reader.read();
      let imageName = decoder.decode(value);

      if (imageName[0] === `"` || imageName[0] === `'`) {
        imageName = imageName.slice(1, -1);
      }

      if (imageName[0] === `"` || imageName[0] === `'`) {
        imageName = imageName.slice(1, -1);
      }

      console.log(imageName);

      setOutputImageURL(`/generated/${imageName}`);
    }
  }

  return (
    <main className={styles.main}>
      <SceneEditor
        // generateImage={generateImage}
        generateImageCallback={(imageDataURL, prompt, imageStrength) => {
          const imageBase64 = imageDataURL.split(",")[1];
          const imageBuffer = Buffer.from(imageBase64, "base64");
          const image = new File([imageBuffer], "image.png", {
            type: "image/png",
          });
          // setImage(imageBase64);
          // const prompt = "A painting of two cats";
          // const strength = 0.6;
          generateImage(imageBase64, prompt, imageStrength);
        }}
      />
      {/* <form onSubmit={generateImage}>
        <label>
          Image Strength:
          <input
            type="number"
            step={0.1}
            value={strength}
            onChange={(e) => {
              setStrength(parseFloat(e.target.value));
            }}
          />
        </label>
        <label>
          Text Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (!e.target.files) return;
              setImage(e.target.files[0]);
            }}
          />
        </label>
        <button type="submit">Generate</button>
      </form> */}
      {outputImageURL ? (
        <Image
          alt="Output Image"
          src={`${outputImageURL}?${performance.now()}}`}
          width={500}
          height={500}
        />
      ) : null}
    </main>
  );
}
