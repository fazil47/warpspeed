"use client";

import { useState, Children, cloneElement } from "react";
import { Event, Object3D } from "three";
import { ReactElement } from "react";

import { PivotControls } from "./PivotControls";

export default function SceneMeshes(props: JSX.IntrinsicElements["mesh"]) {
  const [selectedObject, setSelectedObject] = useState<Object3D>();

  return (
    <>
      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        object={selectedObject}
      />
      {Children.map(props.children, (child) => {
        if (!child) return null;
        return cloneElement(child as ReactElement, {
          onClick: (event: Event) => {
            event.stopPropagation();
            setSelectedObject(event.object);
            console.log(event);
          },
        });
      })}
    </>
  );
}
