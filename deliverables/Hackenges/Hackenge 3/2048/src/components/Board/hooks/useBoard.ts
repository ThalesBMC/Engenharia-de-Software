import { useContext } from "react";
import { BoardContext } from "../context/BoardContext";

export const useBoard = () => {
  const { containerWidth, tileCount } = useContext(BoardContext);
  return [containerWidth, tileCount] as [number, number];
};
