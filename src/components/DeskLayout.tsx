import React from "react";
import DeskGroup from "./DeskGroup";
import { DeskGroupObject } from "../types/desks";
import { useDeskGroups } from "../services/queries";

const getAllDeskGroups = (deskGroups: DeskGroupObject[]): JSX.Element[] => {
  const groups: JSX.Element[] = [];

  for (const [index, group] of deskGroups.entries()) {
    groups.push(
      <DeskGroup key={index} desks={group.desks} x={group.x} y={group.y} />,
    );
  }

  return groups;
};

const DeskLayout: React.FC = () => {
  const deskGroups: DeskGroupObject[] | undefined = useDeskGroups().data;
  return !deskGroups ? <></> : <div>{getAllDeskGroups(deskGroups)}</div>;
};

export default DeskLayout;
