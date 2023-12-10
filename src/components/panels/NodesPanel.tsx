import { Flex, Text, Input, Button, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';

type GraphData = {
	nodes: { id: string; name: string }[];
	links: { source: string; target: string }[];
};

interface PanelProps {
	graphData: GraphData;
	setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const NodesPanel = ({ graphData, setGraphData }: PanelProps) => {
	const toast = useToast();
	const [nodeValue, setNodeValue] = useState('');
	const handleAddNode = () => {
		if (nodeValue === '') {
			toast({
				title: 'node value is empty',
				description: 'node value cannot be empty',
				status: 'info',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		if (graphData.nodes.find((node) => node.id === nodeValue)) {
			toast({
				title: 'node already exists',
				description: `node ${nodeValue} already exists`,
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		setGraphData({
			nodes: [...graphData.nodes, { id: nodeValue, name: nodeValue }],
			links: [...graphData.links],
		});
	};
	return (
		<Flex
			// width="100%"
			// height="200px"
			bg="#1e1e2e"
			color="#cdd6f4"
			m={3}
			p={3}
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius={'8px'}
		>
			<Stack>
				<Text>add a node</Text>
				<Input
					value={nodeValue}
					onChange={(e) => setNodeValue(e.target.value)}
					placeholder="value"
				/>
				<Button
					colorScheme="teal"
					variant={'outline'}
					width="100px"
					onClick={handleAddNode}
				>
					add node
				</Button>
			</Stack>
		</Flex>
	);
};

const EdgesPanel = ({ graphData, setGraphData }: PanelProps) => {
	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const toast = useToast();
	const handleAddEdge = () => {
		if (source === '' || target === '') {
			toast({
				title: 'source or target is empty',
				description: 'source or target cannot be empty',
				status: 'info',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		// link already exists
		const sourceNodeExists = graphData.nodes.find((node) => node.id === source);
		const targetNodeExists = graphData.nodes.find((node) => node.id === target);
		console.log(target, source);
		if (
			graphData.links.some((link) => {
				// @ts-expect-error: source and target MIGHT not be defined on type {source: string, target: string}, but react-force-graph handles them differently
				const sourceId = link.source.id;
				// @ts-expect-error: same as the above
				const targetId = link.target.id;

				return (
					(sourceId === source && targetId === target) ||
					(sourceId === target && targetId === source)
				);
			})
		) {
			toast({
				title: 'edge already exists',
				description: `edge from ${source} to ${target} already exists`,
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		if (sourceNodeExists && targetNodeExists) {
			setGraphData({
				nodes: [...graphData.nodes],
				links: [...graphData.links, { source: source, target: target }],
			});
		} else if (sourceNodeExists && !targetNodeExists) {
			setGraphData({
				nodes: [...graphData.nodes, { id: target, name: target }],
				links: [...graphData.links, { source: source, target: target }],
			});
		} else if (!sourceNodeExists && targetNodeExists) {
			setGraphData({
				nodes: [...graphData.nodes, { id: source, name: source }],
				links: [...graphData.links, { source: source, target: target }],
			});
		} else {
			setGraphData({
				nodes: [
					...graphData.nodes,
					{ id: source, name: source },
					{ id: target, name: target },
				],
				links: [...graphData.links, { source: source, target: target }],
			});
		}
	};
	return (
		<Flex
			// width="100%"
			// height="200px"
			bg="#1e1e2e"
			color="#cdd6f4"
			m={3}
			p={3}
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius={'8px'}
		>
			<Stack spacing={6}>
				<Stack spacing={2}>
					<Text>specify source node</Text>
					<Input
						type="string"
						value={source}
						onChange={(e) => setSource(e.target.value)}
						placeholder="source"
					/>
				</Stack>
				<Stack spacing={2}>
					<Text>specify target node</Text>
					<Input
						type="string"
						value={target}
						onChange={(e) => setTarget(e.target.value)}
						placeholder="target"
					/>
				</Stack>
				<Button
					colorScheme="teal"
					variant={'outline'}
					width="100px"
					onClick={handleAddEdge}
				>
					add edge
				</Button>
			</Stack>
		</Flex>
	);
};

export { NodesPanel, EdgesPanel };
