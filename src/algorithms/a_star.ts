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

// basically dijkstra's algorithm but with a heuristic for the distance

const aStar = (grid: Grid, start: GridLocation, end: GridLocation) => {
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
			for (const node of unvisitedNeighbors) {
				node.distance =
					closestNode.distance + node.weight + manhattanDistance(node, end);
				node.prev = closestNode;
			}
		}
	}
	return visitedNodes;
};

export { aStar };
