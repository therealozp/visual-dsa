type GridNode = {
	row: number;
	column: number;
	isStart: boolean;
	isEnd: boolean;
	visited: boolean;
	obstacle: boolean;
	distance: number;
	prev: GridNode | null;
};

type Grid = GridNode[][];

type GridLocation = {
	row: number;
	column: number;
};

export type { GridNode, Grid, GridLocation };
