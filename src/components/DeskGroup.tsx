import Desk from "../components/Desk";
import {
  deskHeight,
  chairHeight,
  chairOverlap,
  deskWidth,
} from "../components/Desk";
import { useLayoutEffect } from "@tanstack/react-router";
import { useState } from "react";
import { DeskObject } from "../types/desks";

const getDeskPosition = (desk: DeskObject): { x: number; y: number } => {
  const highRes = window.devicePixelRatio > 1;

  const deskAndChairHeight =
    2 * deskHeight + (chairHeight - 2 * chairOverlap) - 3;

  switch (desk.rotation) {
    case 0:
      return {
        x: desk.x * deskWidth - (highRes ? 1 : 2),
        y: desk.y * deskAndChairHeight,
      };
    case 180:
      return {
        x: desk.x * deskWidth,
        y: desk.y * deskAndChairHeight,
      };
    case 270:
      return {
        x: desk.x * deskAndChairHeight,
        y: desk.y * deskWidth + (highRes ? 1 : 2),
      };
    case 90:
      return {
        x: desk.x * deskAndChairHeight,
        y: desk.y * deskWidth,
      };
  }
};

const getDesk = (desk: DeskObject) => {
  const { x, y } = getDeskPosition(desk);
  return (
    <div
      key={desk.id}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <Desk {...desk} />
    </div>
  );
};

const DeskGroup: React.FC<{ desks: DeskObject[]; x: number; y: number }> = ({
  desks,
  x,
  y,
}) => {
  const [allDesks, setAllDesks] = useState(desks.map(getDesk));

  useLayoutEffect(() => {
    const updateDeskPositions = () => setAllDesks(desks.map(getDesk));
    window.addEventListener("resize", updateDeskPositions);
    return () => window.removeEventListener("resize", updateDeskPositions);
  }, [desks]);

  if (!desks.length) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {allDesks}
    </div>
  );
};

export default DeskGroup;
