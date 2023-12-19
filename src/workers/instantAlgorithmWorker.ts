// Import or define Grid, GridLocation, GridNode, getUnvisitedNeighbors here
import { GridNode } from '../components/interfaces/grid.interfaces';
import { bfs } from '../algorithms/bfs';
import { dijkstra } from '../algorithms/dijkstra';
import { backtrack } from '../utils/gridHelperFunctions';

// Listen for messages from the main thread
onmessage = (message) => {
	// console.log(message);
	const { grid, startNode, endNode, algorithm } = message.data;
	let result: GridNode[] = [];

	switch (algorithm) {
		case 'bfs':
			result = bfs(grid, startNode, endNode);
			break;
		case 'dijkstra':
			result = dijkstra(grid, startNode, endNode);
			break;
		default:
			result = [];
	}
	const shortestPath = backtrack(result[result.length - 1], endNode);
	// Post the result back to the main thread
	// console.log('called successfully');
	postMessage({ visitedNodes: result, shortestPath: shortestPath });
};
