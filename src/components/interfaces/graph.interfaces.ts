type Node = {
	id: string;
	name: string;
	index?: number; // Used for binary trees
};

type Edge = {
	source: string;
	target: string;
};

type GraphData = {
	nodes: Node[];
	links: Edge[];
};

type AdjacencyList = {
	[key: string]: string[];
};

type BinaryTreeArray = {
	[key: string]: string[];
};

export type { GraphData, AdjacencyList, Node, Edge, BinaryTreeArray };
