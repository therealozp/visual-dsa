type Node = {
	id: string;
	name: string;
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

export type { GraphData, AdjacencyList, Node, Edge };
