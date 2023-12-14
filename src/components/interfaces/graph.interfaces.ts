type GraphNode = {
	id: string;
	name: string;
	index?: number; // Used for binary trees
};

type GraphEdge = {
	source: string;
	target: string;
};

type GraphData = {
	nodes: GraphNode[];
	links: GraphEdge[];
};

type BinaryTreeNode = {
	id: string;
	name: string;
	childrenCount: number;
	index: number;
};

type BinaryTreeGraphData = {
	nodes: BinaryTreeNode[];
	links: GraphEdge[];
};

type AdjacencyList = {
	[key: string]: string[];
};

type BinaryTreeArray = string[];

export type {
	GraphData,
	AdjacencyList,
	GraphNode,
	GraphEdge,
	BinaryTreeArray,
	BinaryTreeNode,
	BinaryTreeGraphData,
};
