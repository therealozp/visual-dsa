import {
	Grid,
	GridLocation,
	GridNode,
} from '../components/interfaces/grid.interfaces';
import {
	getUnvisitedNeighbors,
	getAllNodes,
	nodeCompare,
} from '../utils/gridHelperFunctions';

const dijkstra = (grid: Grid, start: GridLocation, end: GridLocation) => {
	const visitedNodes: GridNode[] = [];
	grid[start.row][start.column].distance = 0;
	const nodesToVisit: GridNode[] = getAllNodes(grid);
	while (nodesToVisit.length > 0) {
		nodesToVisit.sort(nodeCompare);
		const closestNode = nodesToVisit.shift();
		if (closestNode) {
			// console.log(closestNode.obstacle);
			if (closestNode.obstacle) continue;
			if (closestNode?.distance === Infinity) return visitedNodes;
			closestNode.visited = true;
			visitedNodes.push(closestNode);
			if (closestNode.row == end.row && closestNode.column == end.column)
				return visitedNodes;
			const unvisitedNeighbors = getUnvisitedNeighbors(grid, closestNode);
			// updating the neighbors of the closest node
			for (const node of unvisitedNeighbors) {
				node.distance = closestNode.distance + 1;
				node.prev = closestNode;
			}
		}
	}
	return visitedNodes;
};

export { dijkstra };
