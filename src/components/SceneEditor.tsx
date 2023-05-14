"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  Grid,
  Sky,
} from "@react-three/drei";
import { useControls, button } from "leva";

import { WebGLRenderer } from "three";

import styles from "./SceneEditor.module.css";
import SceneObjects from "@/components/SceneObjects";
import Screenshot from "@/components/Screenshot";
import FirstPersonControlsComponent from "@/components/FirstPersonControlsComponent";
import { Vector3 } from "three";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function SceneEditor({
  generateImage,
  generateImageCallback,
}: {
  generateImage: (image: string, prompt: string, strength: number) => void;
  generateImageCallback: (
    imageDataURL: string,
    prompt: string,
    imageStrength: number
  ) => void;
}) {
  const canvasRef = useRef(null);
  const [takeScreenshot, setTakeScreenshot] = useState(false);
  const [imageDataURL, setImageDataURL] = useState<string>("");

  // Function to convert the scene to an image
  const convertToImage = () => {
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
  };

  const ambientLightControls = useControls("Ambient Light", {
    color: "#ffffff",
    intensity: 1.0,
  });

  const stableDiffusionControls = useControls("Stable Diffusion", {
    imageStrength: 0.3,
    prompt: "A painting of two cats",
    generate: button(() => {
      setTakeScreenshot(true);
    }),
  });

  return (
    <Canvas
      className={styles.canvas}
      ref={canvasRef}
      // gl={new WebGLRenderer({ preserveDrawingBuffer: true })}
    >
      <FirstPersonControlsComponent />
      <Screenshot
        takeScreenshot={takeScreenshot}
        takeScreenshotCallback={(takeScreenshot, dataURL) => {
          setTakeScreenshot(takeScreenshot);
          if (!takeScreenshot) {
            convertToImage();
            setImageDataURL(dataURL);
            generateImageCallback(
              dataURL,
              stableDiffusionControls.prompt,
              stableDiffusionControls.imageStrength
            );
          }
        }}
      />
      <SceneObjects>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <mesh position={[1, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <pointLight position={[10, 10, 10]} />
      </SceneObjects>
      <Sky distance={450000} sunPosition={[0, 1, 0]} />
      <ambientLight
        color={ambientLightControls.color}
        intensity={ambientLightControls.intensity}
      />
      <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
        // onUpdate={() => {}}
        // TODO: the selected object should be the target
        onTarget={() => new Vector3(0, 0, 0)}
        renderPriority={1}
      >
        <GizmoViewcube />
      </GizmoHelper>
      <Grid sectionColor="#000000" cellColor="#000000" />
    </Canvas>
  );
}
