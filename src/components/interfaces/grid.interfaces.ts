type GridNode = {
	row: number;
	column: number;
	visited: boolean;
	obstacle: boolean;
	distance: number;
	weight: number;
	prev: GridNode | null;
	nodeElement?: Element | null;
};

type Grid = GridNode[][];

type GridLocation = {
	row: number;
	column: number;
};

export type { GridNode, Grid, GridLocation };
