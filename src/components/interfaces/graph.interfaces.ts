type GraphNode = {
	id: string;
	index?: number;
};

type GraphEdge = {
	source: string;
	target: string;
};

type GraphData = {
	nodes: GraphNode[] | BinaryTreeNode[];
	links: GraphEdge[];
};

interface BinaryTreeNode extends GraphNode {
	childrenCount: number;
	index: number;
}

type BinaryTreeData = {
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
	BinaryTreeData,
};
