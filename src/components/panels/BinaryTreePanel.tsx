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
// import { useMode } from '../../../contexts/ModeContext.hook';
import { BinaryTreeGraphData } from '../interfaces/graph.interfaces';

interface PanelProps {
	graphData: BinaryTreeGraphData;
	setGraphData: React.Dispatch<React.SetStateAction<BinaryTreeGraphData>>;
}

const BinaryTreePanel = ({ graphData, setGraphData }: PanelProps) => {
	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const [isRightChild, setIsRightChild] = useState(false);
	// const { mode } = useMode();
	const toast = useToast();
	const reset = () => {
		setSource('');
		setTarget('');
	};

	const handleAddNode = () => {
		if (graphData.nodes.length === 0) {
			// insert node as a root
			setGraphData({
				nodes: [
					...graphData.nodes,
					{ id: source, name: source, index: 0, childrenCount: 0 },
				],
				links: [...graphData.links],
			});
			reset();
			return;
		}

		if (source === '' || target === '') {
			toast({
				title: 'parent or child node is empty',
				description: 'parent or child node cannot be empty',
				status: 'info',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		const sourceNodeExists = graphData.nodes.find((node) => node.id === source);
		const targetNodeExists = graphData.nodes.find((node) => node.id === target);
		console.log(target, source);

		const parentNode = graphData.nodes.find((node) => node.id === source);
		if (
			sourceNodeExists &&
			!targetNodeExists &&
			parentNode &&
			parentNode.childrenCount < 2
		) {
			const parentNodeIndex = graphData.nodes.indexOf(parentNode);
			if (isRightChild) {
				const occupied = graphData.nodes.find(
					(node) => node.index === 2 * parentNode.index + 2
				);
				if (occupied) {
					toast({
						title: 'already has children',
						description: 'this node is already occupied',
						status: 'error',
						duration: 3000,
						isClosable: true,
						position: 'top',
					});
					return;
				}
				const newnodes = [
					...graphData.nodes,
					{
						id: target,
						name: target,
						index: 2 * parentNode.index + 2,
						childrenCount: 0,
					},
				];
				newnodes[parentNodeIndex].childrenCount += 1;
				setGraphData({
					nodes: newnodes,
					links: [...graphData.links, { source: source, target: target }],
				});
			} else {
				if (
					graphData.nodes.find(
						(node) => node.index === 2 * parentNode.index + 1
					)
				) {
					toast({
						title: 'already has children',
						description: 'this node is already occupied',
						status: 'error',
						duration: 3000,
						isClosable: true,
						position: 'top',
					});
					return;
				}
				const newnodes = [
					...graphData.nodes,
					{
						id: target,
						name: target,
						index: 2 * parentNode.index + 1,
						childrenCount: 0,
					},
				];
				newnodes[parentNodeIndex].childrenCount += 1;
				setGraphData({
					nodes: newnodes,
					links: [...graphData.links, { source: source, target: target }],
				});
			}
		} else {
			toast({
				title:
					parentNode?.childrenCount == 2
						? 'already has children'
						: 'some error occured',
				description:
					parentNode?.childrenCount == 2
						? 'this node is already populated'
						: 'some condition violated',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
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
					<Text>
						{graphData.nodes.length === 0
							? 'specify root node'
							: 'specify parent node'}
					</Text>
					<Input
						type="string"
						value={source}
						onChange={(e) => setSource(e.target.value)}
						placeholder="source"
					/>
				</Stack>
				<Stack spacing={2}>
					<Text>specify child node</Text>
					<Input
						type="string"
						value={target}
						onChange={(e) => setTarget(e.target.value)}
						placeholder="target"
						disabled={graphData.nodes.length === 0}
					/>
				</Stack>
				<Checkbox
					isDisabled={graphData.nodes.length === 0}
					checked={isRightChild}
					onChange={() => {
						setIsRightChild(!isRightChild);
						// console.log(isRightChild);
					}}
				>
					is right child?
				</Checkbox>
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

export { BinaryTreePanel };
