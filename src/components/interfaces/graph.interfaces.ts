// index and childrenCount are only required for certain algorithms (eg. binary tree)
// make them optional so callers that don't need them don't have to initialize them.
type GraphNode = {
	id: string;

	// ForceGraph2D auto-assigns an index
	// so we cannot use this
	// re-assign it instead
	binaryTreeNodeIndex?: number;
	childrenCount?: number;
};

type GraphEdge = {
	source: string;
	target: string;
};

type GraphData = {
	nodes: GraphNode[];
	links: GraphEdge[];
};

type AdjacencyList = {
	[key: string]: string[];
};

type BinaryTreeArray = string[];

export type { GraphData, AdjacencyList, GraphNode, GraphEdge, BinaryTreeArray };
