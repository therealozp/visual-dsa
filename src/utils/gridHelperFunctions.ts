import {
	Grid,
	GridLocation,
	GridNode,
} from '../components/interfaces/grid.interfaces.ts';

const getUnvisitedNeighbors = (grid: Grid, node: GridNode) => {
	const unvisited: GridNode[] = [];
	const { row, column } = node;
	if (row > 0) unvisited.push(grid[row - 1][column]);
	if (row < grid.length - 1) unvisited.push(grid[row + 1][column]);
	if (column > 0) unvisited.push(grid[row][column - 1]);
	if (column < grid[0].length - 1) unvisited.push(grid[row][column + 1]);
	return unvisited.filter((node) => !node.visited);
};

const getAllNodes = (grid: Grid) => {
	const nodes: GridNode[] = [];
	for (const row of grid) {
		for (const node of row) {
			nodes.push(node);
		}
	}
	return nodes;
};

const nodeCompare = (nodeA: GridNode, nodeB: GridNode) => {
	return nodeA.distance - nodeB.distance;
};

const backtrack = (lastNode: GridNode, endLocation: GridLocation) => {
	if (!lastNode) return [];
	if (lastNode.row != endLocation.row || lastNode.column != endLocation.column)
		return [];
	const path: GridNode[] = [];
	let curr = lastNode;
	while (curr.prev) {
		path.push(curr);
		curr = curr.prev;
	}
	path.reverse();
	return path;
};

export { getUnvisitedNeighbors, getAllNodes, nodeCompare, backtrack };
