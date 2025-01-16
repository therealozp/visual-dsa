import {
	GraphData,
	AdjacencyList,
	GraphNode,
	GraphEdge,
	BinaryTreeArray,
} from '../components/interfaces/graph.interfaces';

const parseLooseAdjacencyList = (input: string): AdjacencyList => {
	const adjacencyList: AdjacencyList = {};

	// Split input into lines and process each line
	input
		.split('\n') // Split by lines
		.map((line) => line.trim()) // Trim whitespace from each line
		.filter((line) => line && !line.startsWith('//')) // Ignore empty lines or comments
		.forEach((line) => {
			// Try to parse the line
			try {
				// Split line by ":", assume the first part is the key
				const [keyPart, valuePart] = line.split(':', 2);

				// Normalize the key
				const key = String(keyPart).trim();

				// Ensure key exists
				if (!key) throw new Error('Missing key.');

				// Normalize the values
				let values: string[] = [];
				if (valuePart) {
					values = valuePart
						.split(/[,\s]+/) // Split by commas or spaces
						.map((value) => value.trim()) // Normalize each value
						.filter((value) => value); // Remove empty values
				}

				// Add to adjacency list
				adjacencyList[key] = values;
			} catch (error: unknown) {
				const errorMessage = (error as Error).message;
				console.warn(`Skipping malformed line: "${line}"`, errorMessage);
			}
		});

	return adjacencyList;
};

const convertAdjListWrapper = (input: string): GraphData => {
	try {
		return convertAdjacencyListToGraphData(JSON.parse(input));
	} catch (error) {
		const adjacencyList = parseLooseAdjacencyList(input);
		return convertAdjacencyListToGraphData(adjacencyList);
	}
};

const convertAdjacencyListToGraphData = (
	adjacencyList: AdjacencyList
): GraphData => {
	const nodes: GraphNode[] = [];
	const links: GraphEdge[] = [];

	// Normalize and validate keys (node IDs) and create nodes
	Object.keys(adjacencyList).forEach((key) => {
		const normalizedKey = String(key).trim();
		if (normalizedKey) {
			nodes.push({ id: normalizedKey });
		}
	});

	// Normalize and validate edges, then create links
	Object.entries(adjacencyList).forEach(([sourceId, targets]) => {
		const normalizedSourceId = String(sourceId).trim();
		if (!normalizedSourceId) return;

		if (Array.isArray(targets)) {
			targets.forEach((target) => {
				const normalizedTargetId = String(target).trim();
				if (normalizedTargetId) {
					links.push({
						source: normalizedSourceId,
						target: normalizedTargetId,
					});
				}
			});
		}
	});

	return { nodes, links };
};

const convertGraphDataToAdjacencyList = (
	graphData: GraphData
): AdjacencyList => {
	const adjacencyList: AdjacencyList = {};

	// Initialize adjacency list with nodes, normalizing IDs
	graphData.nodes.forEach((node) => {
		if (!node || !node.id) return;
		const normalizedNodeId = String(node.id).trim();
		if (normalizedNodeId) {
			adjacencyList[normalizedNodeId] = [];
		}
	});

	// Populate adjacency list with links, normalizing IDs
	graphData.links.forEach((link) => {
		if (!link || !link.source || !link.target) return;
		const normalizedSourceId = String(link.source).trim();
		const normalizedTargetId = String(link.target).trim();

		if (
			normalizedSourceId &&
			normalizedTargetId &&
			adjacencyList[normalizedSourceId] &&
			!adjacencyList[normalizedSourceId].includes(normalizedTargetId)
		) {
			adjacencyList[normalizedSourceId].push(normalizedTargetId);
		}
	});

	return adjacencyList;
};

const convertBinaryTreeArrayToGraphData = (arr: BinaryTreeArray): GraphData => {
	const conversion = (
		node: number | string | null,
		index: number
	): GraphNode | null => {
		if (node == 'null' || node == null) return null;
		return { id: node.toString(), index: index };
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
	convertAdjListWrapper,
};
