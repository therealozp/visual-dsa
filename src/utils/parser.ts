import {
	GraphData,
	AdjacencyList,
	Node,
	Edge,
} from '../components/interfaces/graph.interfaces';

const convertAdjacencyListToGraphData = (
	adjacencyList: AdjacencyList
): GraphData => {
	const nodes: Node[] = [];
	const links: Edge[] = [];

	// Create nodes from adjacency list keys
	try {
		Object.keys(adjacencyList).forEach((key) => {
			nodes.push({ id: key, name: key });
		});

		// Create links (edges) based on adjacency list
		Object.entries(adjacencyList).forEach(([sourceId, targets]) => {
			targets.forEach((targetId) => {
				links.push({ source: sourceId, target: targetId });
			});
		});

		return { nodes, links };
	} catch (error) {
		console.log('from function', error);
		throw new Error('Invalid adjacency list');
	}
};

const convertGraphDataToAdjacencyList = (
	graphData: GraphData
): AdjacencyList => {
	const adjacencyList: AdjacencyList = {};

	// Initialize the adjacency list with empty arrays for each node
	graphData.nodes.forEach((node) => {
		adjacencyList[node.id] = [];
		// console.log(node.id);
	});
	console.log(graphData);
	console.log(adjacencyList);
	// Populate the adjacency list
	graphData.links.forEach((link) => {
		// For undirected graphs, add both directions
		// console.log(link);
		if (
			adjacencyList[link.source.id] &&
			!adjacencyList[link.source.id].includes(link.target.id)
		) {
			adjacencyList[link.source.id].push(link.target.id);
		}
		// For directed graphs, comment out one of the above blocks
	});

	return adjacencyList;
};
export { convertAdjacencyListToGraphData, convertGraphDataToAdjacencyList };
