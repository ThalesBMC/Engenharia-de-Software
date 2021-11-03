import { useCallback, useEffect, useReducer, useRef, useContext } from "react";
import {
  animationDuration,
  tileCount as tileCountPerRowOrColumn,
} from "../../../Board";
import { TileMeta } from "../../../Tile";
import { useIds } from "../useIds";
import { GameReducer, initialState } from "./reducer";
import { RankingContext } from "../../../../context/RankingContext";

export const useGame = () => {
  const { setValue, valor } = useContext(RankingContext);
  const isInitialRender = useRef(true);
  const [nextId] = useIds();

  const [state, dispatch] = useReducer(GameReducer, initialState);
  const { tiles, byIds, hasChanged, inMotion } = state;

  const createTile = useCallback(
    ({ position, value }: Partial<TileMeta>) => {
      const tile = {
        id: nextId(),
        position,
        value,
      } as TileMeta;
      dispatch({ type: "CREATE_TILE", tile });
      setValue(valor + 2);
    },
    [nextId]
  );

  const mergeTile = (source: TileMeta, destination: TileMeta) => {
    dispatch({ type: "MERGE_TILE", source, destination });
  };

  const throttledMergeTile = (source: TileMeta, destination: TileMeta) => {
    setTimeout(() => mergeTile(source, destination), animationDuration);
  };

  const updateTile = (tile: TileMeta) => {
    dispatch({ type: "UPDATE_TILE", tile });
  };

  const didTileMove = (source: TileMeta, destination: TileMeta) => {
    const hasXChanged = source.position[0] !== destination.position[0];
    const hasYChanged = source.position[1] !== destination.position[1];

    return hasXChanged || hasYChanged;
  };

  const retrieveTileMap = useCallback(() => {
    const tileMap = new Array(
      tileCountPerRowOrColumn * tileCountPerRowOrColumn
    ).fill(0) as number[];

    byIds.forEach((id) => {
      const { position } = tiles[id];
      const index = positionToIndex(position);
      tileMap[index] = id;
    });

    return tileMap;
  }, [byIds, tiles]);

  const findEmptyTiles = useCallback(() => {
    const tileMap = retrieveTileMap();

    const emptyTiles = tileMap.reduce((result, tileId, index) => {
      if (tileId === 0) {
        return [...result, indexToPosition(index) as [number, number]];
      }

      return result;
    }, [] as [number, number][]);

    return emptyTiles;
  }, [retrieveTileMap]);

  const generateRandomTile = useCallback(() => {
    const emptyTiles = findEmptyTiles();

    if (emptyTiles.length > 0) {
      const index = Math.floor(Math.random() * emptyTiles.length);
      const position = emptyTiles[index];

      createTile({ position, value: 2 });
    }
  }, [findEmptyTiles, createTile]);

  const positionToIndex = (position: [number, number]) => {
    return position[1] * tileCountPerRowOrColumn + position[0];
  };

  const indexToPosition = (index: number) => {
    const x = index % tileCountPerRowOrColumn;
    const y = Math.floor(index / tileCountPerRowOrColumn);
    return [x, y];
  };

  type RetrieveTileIdsPerRowOrColumn = (rowOrColumnIndex: number) => number[];

  type CalculateTileIndex = (
    tileIndex: number,
    tileInRowIndex: number,
    howManyMerges: number,
    maxIndexInRow: number
  ) => number;

  const move = (
    retrieveTileIdsPerRowOrColumn: RetrieveTileIdsPerRowOrColumn,
    calculateFirstFreeIndex: CalculateTileIndex
  ) => {
    dispatch({ type: "START_MOVE" });

    const maxIndex = tileCountPerRowOrColumn - 1;

    for (
      let rowOrColumnIndex = 0;
      rowOrColumnIndex < tileCountPerRowOrColumn;
      rowOrColumnIndex += 1
    ) {
      const availableTileIds = retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);

      let previousTile: TileMeta | undefined;

      let mergedTilesCount = 0;

      availableTileIds.forEach((tileId, nonEmptyTileIndex) => {
        const currentTile = tiles[tileId];

        if (
          previousTile !== undefined &&
          previousTile.value === currentTile.value
        ) {
          const tile = {
            ...currentTile,
            position: previousTile.position,
            mergeWith: previousTile.id,
          } as TileMeta;

          throttledMergeTile(tile, previousTile);

          previousTile = undefined;

          mergedTilesCount += 1;

          return updateTile(tile);
        }

        const tile = {
          ...currentTile,
          position: indexToPosition(
            calculateFirstFreeIndex(
              rowOrColumnIndex,
              nonEmptyTileIndex,
              mergedTilesCount,
              maxIndex
            )
          ),
        } as TileMeta;

        previousTile = tile;

        if (didTileMove(currentTile, tile)) {
          return updateTile(tile);
        }
      });
    }

    setTimeout(() => dispatch({ type: "END_MOVE" }), animationDuration);
  };

  const moveLeftFactory = () => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInRow = [
        tileMap[rowIndex * tileCountPerRowOrColumn + 0],
        tileMap[rowIndex * tileCountPerRowOrColumn + 1],
        tileMap[rowIndex * tileCountPerRowOrColumn + 2],
        tileMap[rowIndex * tileCountPerRowOrColumn + 3],
      ];

      const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);
      return nonEmptyTiles;
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInRowIndex: number,
      howManyMerges: number,
      _: number
    ) => {
      return (
        tileIndex * tileCountPerRowOrColumn + tileInRowIndex - howManyMerges
      );
    };

    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };

  const moveRightFactory = () => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInRow = [
        tileMap[rowIndex * tileCountPerRowOrColumn + 0],
        tileMap[rowIndex * tileCountPerRowOrColumn + 1],
        tileMap[rowIndex * tileCountPerRowOrColumn + 2],
        tileMap[rowIndex * tileCountPerRowOrColumn + 3],
      ];

      const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);
      return nonEmptyTiles.reverse();
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInRowIndex: number,
      howManyMerges: number,
      maxIndexInRow: number
    ) => {
      return (
        tileIndex * tileCountPerRowOrColumn +
        maxIndexInRow +
        howManyMerges -
        tileInRowIndex
      );
    };

    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };

  const moveUpFactory = () => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInColumn = [
        tileMap[columnIndex + tileCountPerRowOrColumn * 0],
        tileMap[columnIndex + tileCountPerRowOrColumn * 1],
        tileMap[columnIndex + tileCountPerRowOrColumn * 2],
        tileMap[columnIndex + tileCountPerRowOrColumn * 3],
      ];

      const nonEmptyTiles = tileIdsInColumn.filter((id) => id !== 0);
      return nonEmptyTiles;
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInColumnIndex: number,
      howManyMerges: number,
      _: number
    ) => {
      return (
        tileIndex +
        tileCountPerRowOrColumn * (tileInColumnIndex - howManyMerges)
      );
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };

  const moveDownFactory = () => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInColumn = [
        tileMap[columnIndex + tileCountPerRowOrColumn * 0],
        tileMap[columnIndex + tileCountPerRowOrColumn * 1],
        tileMap[columnIndex + tileCountPerRowOrColumn * 2],
        tileMap[columnIndex + tileCountPerRowOrColumn * 3],
      ];

      const nonEmptyTiles = tileIdsInColumn.filter((id) => id !== 0);
      return nonEmptyTiles.reverse();
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInColumnIndex: number,
      howManyMerges: number,
      maxIndexInColumn: number
    ) => {
      return (
        tileIndex +
        tileCountPerRowOrColumn *
          (maxIndexInColumn - tileInColumnIndex + howManyMerges)
      );
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };

  useEffect(() => {
    if (isInitialRender.current) {
      createTile({ position: [0, 1], value: 2 });
      createTile({ position: [0, 2], value: 2 });
      isInitialRender.current = false;
      return;
    }

    if (!inMotion && hasChanged) {
      generateRandomTile();
    }
  }, [hasChanged, inMotion, createTile, generateRandomTile]);

  const tileList = byIds.map((tileId) => tiles[tileId]);

  const moveLeft = moveLeftFactory();
  const moveRight = moveRightFactory();
  const moveUp = moveUpFactory();
  const moveDown = moveDownFactory();

  return [tileList, moveLeft, moveRight, moveUp, moveDown] as [
    TileMeta[],
    () => void,
    () => void,
    () => void,
    () => void
  ];
};
