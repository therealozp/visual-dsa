import React, { useEffect, useState, useRef, SetStateAction } from 'react';
import { Box, Button, HStack, Textarea, useToast } from '@chakra-ui/react';
import {
	convertAdjacencyListToGraphData,
	convertGraphDataToAdjacencyList,
	convertBinaryTreeArrayToGraphData,
	convertGraphDataToBinaryTreeArray,
} from '../../utils/parser';
import { GraphData } from '../interfaces/graph.interfaces';
import * as dJSON from 'dirty-json';
import { useMode } from '../../../contexts/ModeContext.hook';

interface GraphEditorProps {
	graphData: GraphData;
	setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
	setDraggable: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdjacencyListEditor = ({
	graphData,
	setGraphData,
	setDraggable,
}: GraphEditorProps) => {
	const [adjacencyListText, setAdjacencyListText] = useState(
		JSON.stringify(convertGraphDataToAdjacencyList(graphData), null, 2)
	);
	const toast = useToast();
	const isInternalUpdate = useRef(false);

	useEffect(() => {
		// Only update the text if the change is external
		if (!isInternalUpdate.current) {
			setAdjacencyListText(
				JSON.stringify(convertGraphDataToAdjacencyList(graphData), null, 2)
			);
		}
		// Reset the ref for the next update
		isInternalUpdate.current = false;
	}, [graphData]);

	const handleTextChange = (e: {
		target: { value: SetStateAction<string> };
	}) => {
		setAdjacencyListText(e.target.value);
	};

	const parseAdjacencyList = () => {
		try {
			const adjacencyList = dJSON.parse(adjacencyListText);
			const data = convertAdjacencyListToGraphData(adjacencyList);
			setAdjacencyListText(JSON.stringify(adjacencyList, null, 2));
			// Indicate that the next update is internal
			isInternalUpdate.current = true;
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
				onFocus={() => setDraggable(false)}
				onBlur={() => setDraggable(true)}
			/>
			<HStack m={3}>
				<Button onClick={parseAdjacencyList}>Parse</Button>
			</HStack>
		</Box>
	);
};

const BinaryTreeEditor = ({
	graphData,
	setGraphData,
	setDraggable,
}: GraphEditorProps) => {
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
				onFocus={() => setDraggable(false)}
				onBlur={() => setDraggable(true)}
			/>
			<HStack m={3}>
				<Button onClick={parseBinaryArray}>Parse</Button>
			</HStack>
		</Box>
	);
};

const GraphEditor = ({
	graphData,
	setGraphData,
	setDraggable,
}: GraphEditorProps) => {
	const { mode } = useMode();

	return (
		<>
			{mode == 'bst' ? (
				<BinaryTreeEditor
					graphData={graphData}
					setGraphData={setGraphData}
					setDraggable={setDraggable}
				/>
			) : (
				<AdjacencyListEditor
					graphData={graphData}
					setGraphData={setGraphData}
					setDraggable={setDraggable}
				/>
			)}
		</>
	);
};

export default GraphEditor;
