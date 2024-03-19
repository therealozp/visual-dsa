import {
	Grid,
	GridLocation,
	GridNode,
} from '../components/interfaces/grid.interfaces';
import {
	getUnvisitedNeighbors,
	getAllNodes,
	nodeCompare,
	manhattanDistance,
} from '../utils/gridHelperFunctions';

// here the heuristic is assumed to be the manhattan distance
const greedyBfs = (grid: Grid, start: GridLocation, end: GridLocation) => {
	const visitedNodes: GridNode[] = [];
	grid[start.row][start.column].distance = 0;
	const nodesToVisit: GridNode[] = getAllNodes(grid);
	while (nodesToVisit.length > 0) {
		nodesToVisit.sort(nodeCompare);
		const closestNode = nodesToVisit.shift();
		if (closestNode) {
			if (closestNode.obstacle) continue;
			if (closestNode.distance === Infinity) return visitedNodes;
			closestNode.visited = true;
			visitedNodes.push(closestNode);
			if (closestNode.row == end.row && closestNode.column == end.column)
				return visitedNodes;
			const unvisitedNeighbors = getUnvisitedNeighbors(grid, closestNode);
			// updating the neighbors of the closest node
			// using the heuristic function instead of the closest-node weight
			for (const neighbor of unvisitedNeighbors) {
				neighbor.distance = manhattanDistance(neighbor, end);
				neighbor.prev = closestNode;
			}
		}
	}
	return visitedNodes;
};

export { greedyBfs };
