import {
	Flex,
	Text,
	Input,
	Button,
	Stack,
	useToast,
	Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';
import { GraphData } from '../interfaces/graph.interfaces';

interface PanelProps {
	graphData: GraphData;
	setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const BinaryTreePanel = ({ graphData, setGraphData }: PanelProps) => {
	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const [isRightChild, setIsRightChild] = useState(false);
	const toast = useToast();

	const reset = () => {
		setSource('');
		setTarget('');
	};

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
		if (!source || (graphData.nodes.length > 0 && !target)) {
			showToast(
				'Invalid input',
				'Parent or child node cannot be empty',
				'info'
			);
			return;
		}

		const sourceNode = graphData.nodes.find((node) => node.id === source);
		const targetNodeExists = graphData.nodes.some((node) => node.id === target);

		if (!sourceNode && graphData.nodes.length > 0) {
			showToast('Invalid parent node', 'Parent node does not exist', 'error');
			reset();

			return;
		}

		if (targetNodeExists) {
			showToast('Node exists', 'Target node already exists', 'error');
			reset();

			return;
		}

		if (sourceNode && (sourceNode.childrenCount ?? 0) >= 2) {
			showToast(
				'Node occupied',
				'Parent node already has two children',
				'error'
			);
			reset();

			return;
		}

		const parentIndex = sourceNode ? (sourceNode.index ?? 0) : undefined;
		const newIndex =
			parentIndex !== undefined
				? isRightChild
					? 2 * parentIndex + 2
					: 2 * parentIndex + 1
				: 0;
		const occupied = graphData.nodes.some((node) => node.index === newIndex);

		if (occupied) {
			showToast('Node occupied', 'This position is already occupied', 'error');
			reset();

			return;
		}

		const newNodes = [
			...graphData.nodes,
			{ id: target, name: target, index: newIndex, childrenCount: 0 },
		];

		if (sourceNode) {
			const parentNodeIndex = newNodes.indexOf(sourceNode);
			newNodes[parentNodeIndex].childrenCount =
				(newNodes[parentNodeIndex].childrenCount ?? 0) + 1;
		}

		setGraphData({
			nodes: newNodes,
			links: [...graphData.links, { source, target }],
		});
		reset();
	};

	return (
		<Flex
			width="100%"
			bg="#1e1e2e"
			color="#cdd6f4"
			p={3}
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius="8px"
		>
			<Stack spacing={6}>
				<Stack spacing={2}>
					<Text>
						{graphData.nodes.length === 0
							? 'Specify root node'
							: 'Specify parent node'}
					</Text>
					<Input
						type="text"
						value={source}
						onChange={(e) => setSource(e.target.value)}
						placeholder="Source"
					/>
				</Stack>
				<Stack spacing={2}>
					<Text>Specify child node</Text>
					<Input
						type="text"
						value={target}
						onChange={(e) => setTarget(e.target.value)}
						placeholder="Target"
						disabled={graphData.nodes.length === 0}
					/>
				</Stack>
				<Checkbox
					isDisabled={graphData.nodes.length === 0}
					isChecked={isRightChild}
					onChange={() => setIsRightChild(!isRightChild)}
				>
					Is right child?
				</Checkbox>
				<Button
					colorScheme="teal"
					variant="outline"
					width="100px"
					onClick={handleAddNode}
				>
					Add node
				</Button>
			</Stack>
		</Flex>
	);
};

export { BinaryTreePanel };
