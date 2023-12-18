import {
	Grid,
	GridLocation,
	GridNode,
} from '../components/interfaces/grid.interfaces';
import { getUnvisitedNeighbors } from '../utils/gridHelperFunctions';

const bfs = (grid: Grid, start: GridLocation, end: GridLocation) => {
	const visitedNodes: GridNode[] = [];
	const queue: GridNode[] = [];
	queue.push(grid[start.row][start.column]);
	while (queue && queue.length > 0) {
		const curr = queue.shift();
		if (!curr) return visitedNodes;
		if (curr.obstacle) continue;

		curr.visited = true;
		visitedNodes.push(curr);

		if (curr.column == end.column && curr.row == end.row) {
			return visitedNodes;
		}

		const neighbors = getUnvisitedNeighbors(grid, curr);
		for (const node of neighbors) {
			if (node.visited) continue;
			// if (node.obstacle) continue;
			node.visited = true;
			node.prev = curr;
			queue.push(node);
		}
	}
	return visitedNodes;
};

export { bfs };
