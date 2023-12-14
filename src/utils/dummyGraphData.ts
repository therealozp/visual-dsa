const defaultUndirectedGraphData = {
	nodes: [
		{ id: '1', name: '1' },
		{ id: '2', name: '2' },
		{ id: '3', name: '3' },
		{ id: '4', name: '4' },
		{ id: '5', name: '5' },
		{ id: '6', name: '6' },
	],
	links: [
		{ source: '1', target: '2' },
		{ source: '1', target: '3' },
		{ source: '2', target: '4' },
		{ source: '2', target: '5' },
		{ source: '3', target: '6' },
	],
};

const defaultDirectedGraphData = {
	nodes: [
		{ id: '1', name: '1' },
		{ id: '2', name: '2' },
		{ id: '3', name: '3' },
		{ id: '4', name: '4' },
		{ id: '5', name: '5' },
		{ id: '6', name: '6' },
	],
	links: [
		{ source: '1', target: '2' },
		{ source: '1', target: '3' },
		{ source: '3', target: '1' },
		{ source: '2', target: '4' },
		{ source: '2', target: '5' },
		{ source: '3', target: '6' },
		{ source: '6', target: '1' },
	],
};

const defaultWeightedGraphData = {
	nodes: [
		{ id: '1', name: '1' },
		{ id: '2', name: '2' },
		{ id: '3', name: '3' },
		{ id: '4', name: '4' },
		{ id: '5', name: '5' },
		{ id: '6', name: '6' },
	],
	links: [
		{ source: '1', target: '2', weight: 1 },
		{ source: '1', target: '3', weight: 2 },
		{ source: '2', target: '4', weight: 3 },
		{ source: '2', target: '5', weight: 4 },
		{ source: '3', target: '6', weight: 5 },
	],
};

const defaultBinaryTreeData = {
	nodes: [
		{ id: '1', name: '1', childrenCount: 2 },
		{ id: '2', name: '2', childrenCount: 2 },
		{ id: '3', name: '3', childrenCount: 1 },
		{ id: '4', name: '4', childrenCount: 0 },
		{ id: '5', name: '5', childrenCount: 0 },
		{ id: '6', name: '6', childrenCount: 0 },
	],
	links: [
		{ source: '1', target: '2' },
		{ source: '1', target: '3' },
		{ source: '2', target: '4' },
		{ source: '2', target: '5' },
		{ source: '3', target: '6' },
	],
};

export {
	defaultUndirectedGraphData,
	defaultDirectedGraphData,
	defaultWeightedGraphData,
	defaultBinaryTreeData,
};
