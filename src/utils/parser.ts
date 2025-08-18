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
	// helper: treat null/undefined/'null' as absent
	const isValidValue = (
		v: number | string | null | undefined
	): v is number | string => v !== null && v !== undefined && v !== 'null';

	if (arr.length === 0) return { nodes: [], links: [] };

	const nodesMap = new Map<string, GraphNode>();
	const links: GraphEdge[] = [];

	for (let i = 0; i < arr.length; i++) {
		const val = arr[i];

		// If the parent slot is invalid but any child is present, that's an invalid representation.
		const leftIdx = 2 * i + 1;
		const rightIdx = 2 * i + 2;
		const leftPresent = leftIdx < arr.length && isValidValue(arr[leftIdx]);
		const rightPresent = rightIdx < arr.length && isValidValue(arr[rightIdx]);

		if (!isValidValue(val)) {
			if (leftPresent || rightPresent) {
				console.error(
					`Invalid binary tree array: null parent at index ${i} has children.`
				);
				throw new Error(
					'Invalid binary tree array: null parent with non-null children'
				);
			}
			continue; // skip empty slot
		}

		const id = String(val);
		// create node with binaryTreeNodeIndex and childrenCount (will increment below)
		const node: GraphNode = { id, binaryTreeNodeIndex: i, childrenCount: 0 };
		nodesMap.set(id, node);

		// add left child link if present
		if (leftPresent) {
			const leftId = String(arr[leftIdx]);
			links.push({ source: id, target: leftId });
			node.childrenCount = (node.childrenCount ?? 0) + 1;
		}
		// add right child link if present
		if (rightPresent) {
			const rightId = String(arr[rightIdx]);
			links.push({ source: id, target: rightId });
			node.childrenCount = (node.childrenCount ?? 0) + 1;
		}
	}

	const nodes = Array.from(nodesMap.values());
	return { nodes, links };
};

const convertGraphDataToBinaryTreeArray = (
	graphData: GraphData
): BinaryTreeArray => {
	const nodeIndexMap = new Map();

	if (graphData.nodes.length === 0) return [];

	graphData.nodes.forEach((node) => {
		if (!node) return;
		if (node.binaryTreeNodeIndex !== undefined) {
			nodeIndexMap.set(node.id, node.binaryTreeNodeIndex);
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
