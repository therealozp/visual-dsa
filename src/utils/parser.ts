import {
	GraphData,
	AdjacencyList,
	GraphNode,
	GraphEdge,
	BinaryTreeArray,
} from '../components/interfaces/graph.interfaces';

const convertAdjacencyListToGraphData = (
	adjacencyList: AdjacencyList
): GraphData => {
	const nodes: GraphNode[] = [];
	const links: GraphEdge[] = [];

	// Create nodes from adjacency list keys
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
};

const convertGraphDataToAdjacencyList = (
	graphData: GraphData
): AdjacencyList => {
	const adjacencyList: AdjacencyList = {};

	// Initialize the adjacency list with empty arrays for each node
	graphData.nodes.forEach((node) => {
		if (!node) return;
		adjacencyList[node.id] = [];
		// console.log(node.id);
	});
	console.log(graphData);
	console.log(adjacencyList);
	// Populate the adjacency list
	graphData.links.forEach((link) => {
		// For undirected graphs, add both directions
		// console.log(link);
		if (!link) return;
		if (
			adjacencyList[(link.source as unknown as GraphNode).id] &&
			!adjacencyList[(link.source as unknown as GraphNode).id].includes(
				(link.target as unknown as GraphNode).id
			)
		) {
			adjacencyList[(link.source as unknown as GraphNode).id].push(
				(link.target as unknown as GraphNode).id
			);
		}
		// For directed graphs, comment out one of the above blocks
	});

	return adjacencyList;
};

const convertBinaryTreeArrayToGraphData = (arr: BinaryTreeArray): GraphData => {
	const conversion = (
		node: number | string | null,
		index: number
	): GraphNode | null => {
		if (node == 'null' || node == null) return null;
		return { id: node.toString(), name: node.toString(), index: index };
	};

	if (arr.length === 0) return { nodes: [], links: [] };

	const nodes = arr
		.map((node, index) => conversion(node, index))
		.filter((node): node is GraphNode => node != null);
	const links: GraphEdge[] = [];

	// Create nodes from adjacency list keys
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] == null && (arr[2 * i + 1] != null || arr[2 * i + 2] != null)) {
			console.error('There is a null value with children in the array!');
			throw new Error('Invalid binary tree array');
		}
		if (2 * i + 1 < arr.length && arr[2 * i + 1] != null) {
			links.push({ source: arr[i], target: arr[2 * i + 1] });
		}
		if (2 * i + 2 < arr.length && arr[2 * i + 2] != null) {
			links.push({ source: arr[i], target: arr[2 * i + 2] });
		}
	}

	// console.log('nodes from binary parse: ', nodes);
	// console.log('links: ', links);
	return { nodes, links };
};

const convertGraphDataToBinaryTreeArray = (
	graphData: GraphData
): BinaryTreeArray => {
	const nodeIndexMap = new Map();

	if (graphData.nodes.length === 0) return [];

	graphData.nodes.forEach((node) => {
		if (!node) return;
		if (node.index !== undefined) {
			nodeIndexMap.set(node.id, node.index);
		}
	});

	// Find the maximum index to determine the size of the binary tree array
	const maxSize = Math.max(...Array.from(nodeIndexMap.values())) + 1;
	const binaryTreeArray = new Array(maxSize).fill(null);

	graphData.links.forEach((link) => {
		if (!link) return;
		const parentIndex = nodeIndexMap.get(link.source);
		const childIndex = nodeIndexMap.get(link.target);
		if (
			childIndex === 2 * parentIndex + 1 ||
			childIndex === 2 * parentIndex + 2
		) {
			binaryTreeArray[childIndex] = link.target;
		}
	});

	// Fill in the non-null nodes
	nodeIndexMap.forEach((index, nodeId) => {
		binaryTreeArray[index] = nodeId;
	});

	return binaryTreeArray;
};

export {
	convertAdjacencyListToGraphData,
	convertGraphDataToAdjacencyList,
	convertBinaryTreeArrayToGraphData,
	convertGraphDataToBinaryTreeArray,
};
