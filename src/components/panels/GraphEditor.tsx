import { useEffect, useState, useRef, SetStateAction } from 'react';
import { Box, Button, HStack, Textarea, useToast } from '@chakra-ui/react';
import {
	convertAdjacencyListToGraphData,
	convertGraphDataToAdjacencyList,
} from '../../utils/parser';
import { GraphData } from '../interfaces/graph.interfaces';
import * as dJSON from 'dirty-json';

interface GraphEditorProps {
	graphData: GraphData;
	setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const GraphEditor = ({ graphData, setGraphData }: GraphEditorProps) => {
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
		<Box
			bg="#1e1e2e"
			color="#cdd6f4"
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius={'8px'}
		>
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

export default GraphEditor;
