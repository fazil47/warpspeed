// A component which takes a screenshot of the react-three-fiber canvas and sends it to the server.
import { useThree } from "@react-three/fiber";

import { useEffect } from "react";

export default function Screenshot({
  takeScreenshot,
  takeScreenshotCallback,
}: {
  takeScreenshot: boolean;
  takeScreenshotCallback: (takeScreenshot: boolean, dataURL: any) => void;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    if (takeScreenshot) {
      gl.render(scene, camera);
      const dataURL = gl.domElement.toDataURL();
      // const image = new Image();
      // image.src = dataURL;
      // document.body.appendChild(image);
      takeScreenshotCallback(false, dataURL);
    }
  }, [
    gl.domElement,
    takeScreenshotCallback,
    takeScreenshot,
    camera,
    gl,
    scene,
  ]);

  return <></>;
}
