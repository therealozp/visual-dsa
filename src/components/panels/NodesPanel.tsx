import {
	Flex,
	Text,
	Input,
	Button,
	Stack,
	useToast,
	HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMode } from '../../../contexts/ModeContext.hook';
import { GraphEdge } from '../interfaces/graph.interfaces';
import { useGraphDataContext } from '../../../contexts/GraphDataContext';

const NodesPanel = () => {
	const { graphData, setGraphData } = useGraphDataContext();
	const toast = useToast();
	const [nodeValue, setNodeValue] = useState('');

	const showToast = (
		title: string,
		description: string,
		status: 'info' | 'error'
	) => {
		toast({
			title,
			description,
			status,
			duration: 3000,
			isClosable: true,
			position: 'top',
		});
	};

	const handleAddNode = () => {
		if (nodeValue === '') {
			showToast('node value is empty', 'node value cannot be empty', 'info');
			return;
		}
		if (graphData.nodes.find((node) => node.id === nodeValue)) {
			showToast(
				'node already exists',
				`node ${nodeValue} already exists`,
				'error'
			);
			return;
		}
		setGraphData({
			nodes: [...graphData.nodes, { id: nodeValue }],
			links: [...graphData.links],
		});
		setNodeValue('');
	};

	const handleDeleteNode = () => {
		if (nodeValue === '') {
			showToast('node value is empty', 'node value cannot be empty', 'info');
			return;
		}
		if (!graphData.nodes.find((node) => node.id === nodeValue)) {
			showToast(
				'node does not exist',
				`node ${nodeValue} does not exist`,
				'error'
			);
			return;
		}
		setGraphData({
			nodes: graphData.nodes.filter((node) => node.id !== nodeValue),
			links: graphData.links.filter(
				(link) => link.source !== nodeValue && link.target !== nodeValue
			),
		});
		setNodeValue('');
	};

	return (
		<Flex
			width="100%"
			// height="200px"
			bg="#1e1e2e"
			color="#cdd6f4"
			p={3}
			mt={0}
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius={'8px'}
		>
			<Stack>
				<Text fontSize="lg">add a node</Text>
				<Input
					value={nodeValue}
					onChange={(e) => setNodeValue(e.target.value)}
					placeholder="value"
				/>
				<HStack>
					<Button
						colorScheme="teal"
						variant={'outline'}
						width="100px"
						onClick={handleAddNode}
					>
						add node
					</Button>
					<Button
						colorScheme="red"
						variant={'outline'}
						onClick={handleDeleteNode}
					>
						delete node
					</Button>
				</HStack>
			</Stack>
		</Flex>
	);
};

const EdgesPanel = () => {
	const { graphData, setGraphData } = useGraphDataContext();
	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const { mode } = useMode();
	const toast = useToast();
	const reset = () => {
		setSource('');
		setTarget('');
	};
	const checkEdgeExists = (link: GraphEdge) => {
		return (
			(link.source === source && link.target === target) ||
			(link.source === target && link.target === source)
		);
	};
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

		if (graphData.links.some((link) => checkEdgeExists(link))) {
			toast({
				title: 'edge already exists',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		if (mode === 'dir_g' || (sourceNodeExists && targetNodeExists)) {
			setGraphData({
				nodes: [...graphData.nodes],
				links: [...graphData.links, { source: source, target: target }],
			});
		} else {
			const newNodes = [...graphData.nodes];
			if (!sourceNodeExists) newNodes.push({ id: source });
			if (!targetNodeExists) newNodes.push({ id: target });
			setGraphData({
				nodes: newNodes,
				links: [...graphData.links, { source, target }],
			});
		}
		reset();
	};
	return (
		<Flex
			width="100%"
			// height="200px"
			bg="#1e1e2e"
			color="#cdd6f4"
			p={3}
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius={'8px'}
		>
			<Stack spacing={6}>
				<Stack spacing={2}>
					<Text fontSize="lg">specify source node</Text>
					<Input
						type="string"
						value={source}
						onChange={(e) => setSource(e.target.value)}
						placeholder="source"
					/>
				</Stack>
				<Stack spacing={2}>
					<Text fontSize="lg">specify target node</Text>
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

const GraphPanel = () => {
	return (
		<>
			<NodesPanel />
			<EdgesPanel />
		</>
	);
};

export { NodesPanel, EdgesPanel, GraphPanel };
