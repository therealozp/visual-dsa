type GridNode = {
	row: number;
	column: number;
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
