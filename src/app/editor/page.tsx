"use client";
import { useState } from "react";
import styles from "./page.module.css";
import SceneEditor from "@/components/SceneEditor";
import html2canvas from "html2canvas";

export default function Editor() {
  const [image, setImage] = useState<File>();
  const [prompt, setPrompt] = useState<string>("");
  const [strength, setStrength] = useState<number>(0.3);

  async function generateImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!image) return;

    const formData = new FormData();

    formData.append("image", image);
    formData.append("prompt", prompt);
    formData.append("strength", strength.toString());
    formData.append("apiHost", "https://api.stability.ai");

    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    console.log(await response);
  }

  return (
    <main className={styles.main}>
      <SceneEditor />
      <form onSubmit={generateImage}>
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
      </form>
    </main>
  );
}
