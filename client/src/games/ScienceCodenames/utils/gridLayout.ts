export const GRID_SIZE = 5;
export const TOTAL_CARDS = 25;

export interface GridPosition {
  row: number;
  col: number;
}

export const indexToPosition = (index: number): GridPosition => {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
};

export const positionToIndex = (position: GridPosition): number => {
  return position.row * GRID_SIZE + position.col;
};

export const getAdjacentPositions = (position: GridPosition): GridPosition[] => {
  const adjacent: GridPosition[] = [];
  const { row, col } = position;

  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
      adjacent.push({ row: newRow, col: newCol });
    }
  }

  return adjacent;
};
