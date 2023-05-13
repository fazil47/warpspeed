"use client";

import { Canvas } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  Grid,
  Sky,
} from "@react-three/drei";
import { useControls } from "leva";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";

import styles from "./SceneEditor.module.css";
import SceneObjects from "@/components/SceneObjects";
import FirstPersonControlsComponent from "@/components/FirstPersonControlsComponent";
import { Vector3 } from "three";

export default function SceneEditor() {
  const canvas = useThree((state)=>state.gl.domElement)


  useEffect(() => {
    // Render the Three.js scene and convert it to an image
    html2canvas(canvas).then((canvas2) => {
      const imageData = canvas2.toDataURL();
      const additionalData = {
        numbers: [1, 2, 3],
        strings: ['Hello', 'World'],
      };
      sendImageToServer(imageData, additionalData);
    });
  }, []);

  const ambientLightControls = useControls("Ambient Light", {
    color: "#ffffff",
    intensity: 1.0,
  });

  return (
    <Canvas className={styles.canvas}>
      <FirstPersonControlsComponent />
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
function sendImageToServer(imageData: string, additionalData: { numbers: number[]; strings: string[]; }) {
  throw new Error("Function not implemented.");
}

