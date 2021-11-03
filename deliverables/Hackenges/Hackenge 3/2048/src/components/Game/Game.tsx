import React, { useEffect } from "react";
import { useThrottledCallback } from "use-debounce";
import { RankingContext } from "../../context/RankingContext";
import { useGame } from "./hooks/useGame";
import { Board, animationDuration, tileCount } from "../Board";
let soma = 0;
export const Game = () => {
  const { setValue } = React.useContext(RankingContext);
  const [tiles, moveLeft, moveRight, moveUp, moveDown] = useGame();

  const handleKeyDown = (e: KeyboardEvent) => {
    // disables page scrolling with keyboard arrows
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        moveLeft();

        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
    }
  };

  // protects the reducer from being flooded with events.
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);

  return <Board tiles={tiles} tileCountPerRow={tileCount} />;
};
