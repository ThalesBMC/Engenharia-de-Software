import React, { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { usePrevProps } from "../../hooks/usePrevProps";
import { useBoard } from "../Board";
import "./tile.less";

type Props = {
  value: number;

  position: [number, number];

  zIndex: number;
};

let cont = 0;
export const Tile = ({ value, position, zIndex }: Props) => {
  const [containerWidth, tileCount] = useBoard();

  const [scale, setScale] = useState(1);

  const previousValue = usePrevProps<number>(value);

  const withinBoardBoundaries =
    position[0] < tileCount && position[1] < tileCount;
  invariant(withinBoardBoundaries, "Tile out of bound");

  const isNew = previousValue === undefined;

  const hasChanged = previousValue !== value;

  const shallHighlight = isNew || hasChanged;

  useEffect(() => {
    if (shallHighlight) {
      setScale(1.1);
      setTimeout(() => setScale(1), 100);
    }
  }, [shallHighlight, scale]);

  /**
   * Converts tile position from array index to pixels.
   */
  const positionToPixels = (position: number) => {
    return (position / tileCount) * (containerWidth as number);
  };

  // all animations come from CSS transition, and we pass them as styles
  const style = {
    top: positionToPixels(position[1]),
    left: positionToPixels(position[0]),
    transform: `scale(${scale})`,
    zIndex,
  };

  return (
    <div className={`tile tile-${value}`} style={style}>
      {value}
    </div>
  );
};
