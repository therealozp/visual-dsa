import React, { useEffect, useState, useRef, SetStateAction } from 'react';
import { Box, Button, HStack, Textarea, useToast } from '@chakra-ui/react';
import {
	convertGraphDataToAdjacencyList,
	convertBinaryTreeArrayToGraphData,
	convertGraphDataToBinaryTreeArray,
	convertAdjListWrapper,
} from '../../utils/parser';
import { GraphData } from '../interfaces/graph.interfaces';
import { useMode } from '../../../contexts/ModeContext.hook';

interface GraphEditorProps {
	graphData: GraphData;
	setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const AdjacencyListEditor = ({ graphData, setGraphData }: GraphEditorProps) => {
	const [adjacencyListText, setAdjacencyListText] = useState(
		JSON.stringify(convertGraphDataToAdjacencyList(graphData), null, 2)
	);
	const toast = useToast();

	useEffect(() => {
		// Only update the text if the change is external
		setAdjacencyListText(
			JSON.stringify(convertGraphDataToAdjacencyList(graphData), null, 2)
		);
	}, [graphData]);

	const handleTextChange = (e: {
		target: { value: SetStateAction<string> };
	}) => {
		setAdjacencyListText(e.target.value);
	};

	const parseAdjacencyList = () => {
		try {
			const data = convertAdjListWrapper(adjacencyListText);
			setAdjacencyListText(
				JSON.stringify(convertGraphDataToAdjacencyList(data), null, 2)
			);
			// Indicate that the next update is internal
			setGraphData(data);
			toast({
				title: 'success',
				description: 'graph updated!',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: 'error parsing :(',
				description: (error as Error).message,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	useEffect(() => {
		const handleCtrlS = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 's') {
				event.preventDefault();
				parseAdjacencyList();
			}
		};
		window.addEventListener('keydown', handleCtrlS);
		return () => {
			window.removeEventListener('keydown', handleCtrlS);
		};
	});

	return (
		<Box bg="#1e1e2e" color="#cdd6f4" borderRadius={'8px'} width={'100%'}>
			<Textarea
				placeholder="Enter adjacency list here"
				value={adjacencyListText}
				onChange={handleTextChange}
				minHeight="300px"
				fontFamily={'Menlo, monospace'}
			/>
			<HStack m={3}>
				<Button onClick={parseAdjacencyList}>Parse</Button>
			</HStack>
		</Box>
	);
};

const BinaryTreeEditor = ({ graphData, setGraphData }: GraphEditorProps) => {
	const [binTreeText, setBinTreeText] = useState(
		JSON.stringify(convertGraphDataToBinaryTreeArray(graphData))
	);

	const toast = useToast();
	const isInternalUpdate = useRef(false);

	useEffect(() => {
		// Only update the text if the change is external
		if (!isInternalUpdate.current) {
			setBinTreeText(
				JSON.stringify(convertGraphDataToBinaryTreeArray(graphData))
			);
		}
		// Reset the ref for the next update
		isInternalUpdate.current = false;
	}, [graphData]);

	const handleTextChange = (e: {
		target: { value: SetStateAction<string> };
	}) => {
		setBinTreeText(e.target.value);
	};

	const parseBinaryArray = () => {
		try {
			if (binTreeText == '') {
				isInternalUpdate.current = true;
				setGraphData({ nodes: [], links: [] });
			} else {
				const binTreeArr = JSON.parse(binTreeText);
				console.log(binTreeArr);
				const data = convertBinaryTreeArrayToGraphData(binTreeArr);
				setBinTreeText(JSON.stringify(binTreeArr));
				// Indicate that the next update is internal
				isInternalUpdate.current = true;
				setGraphData(data);
			}

			toast({
				title: 'success',
				description: 'graph updated!',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: 'error parsing :(',
				description: (error as Error).message,
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	useEffect(() => {
		const handleCtrlS = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 's') {
				event.preventDefault();
				parseBinaryArray();
			}
		};
		window.addEventListener('keydown', handleCtrlS);
		return () => {
			window.removeEventListener('keydown', handleCtrlS);
		};
	});

	return (
		<Box bg="#1e1e2e" color="#cdd6f4" borderRadius={'8px'} width={'100%'}>
			<Textarea
				placeholder="Enter adjacency list here"
				value={binTreeText}
				onChange={handleTextChange}
				minHeight="300px"
				fontFamily={'Menlo, monospace'}
			/>
			<HStack m={3}>
				<Button onClick={parseBinaryArray}>Parse</Button>
			</HStack>
		</Box>
	);
};

const GraphEditor = ({ graphData, setGraphData }: GraphEditorProps) => {
	const { mode } = useMode();

	return (
		<>
			{mode == 'bst' ? (
				<BinaryTreeEditor graphData={graphData} setGraphData={setGraphData} />
			) : (
				<AdjacencyListEditor
					graphData={graphData}
					setGraphData={setGraphData}
				/>
			)}
		</>
	);
};

export default GraphEditor;
