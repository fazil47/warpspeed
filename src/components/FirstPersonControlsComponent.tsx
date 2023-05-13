import FirstPersonControls from "@/utils/FirstPersonControls";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

export default function FirstPersonControlsComponent() {
  const [firstPersonControls, setFirstPersonControls] =
    useState<FirstPersonControls>();
  const camera = useThree((state) => state.camera);
  const element = useThree((state) => state.gl.domElement);

  useEffect(() => {
    let firstPersonControls = new FirstPersonControls(camera, element);
    setFirstPersonControls(firstPersonControls);

    return () => {
      firstPersonControls.dispose();
    };
  }, [camera, element]);

  useFrame((_state, delta) => {
    if (firstPersonControls) {
      firstPersonControls.update(delta);
    }
  });

  return <></>;
}
