import {
	useEffect,
	useState,
	useRef,
	SetStateAction,
	useMemo,
	useCallback,
} from 'react';
import { Box, Button, HStack, Textarea, useToast } from '@chakra-ui/react';
import {
	convertGraphDataToAdjacencyList,
	convertBinaryTreeArrayToGraphData,
	convertGraphDataToBinaryTreeArray,
	convertAdjListWrapper,
} from '../../utils/parser';
// GraphData type available via context where needed
import { useMode } from '../../../contexts/ModeContext.hook';
import { useGraphDataContext } from '../../../contexts/GraphDataContext';

const AdjacencyListEditor = () => {
	const { graphData, setGraphData } = useGraphDataContext();
	const toast = useToast();

	const formatted = useMemo(() => {
		const fmted = JSON.stringify(
			convertGraphDataToAdjacencyList(graphData),
			null,
			2
		);
		return fmted;
	}, [graphData]);

	// Local draft only when editing
	const [draft, setDraft] = useState<string>('');
	const [dirty, setDirty] = useState(false);
	const [parseError, setParseError] = useState<string | null>(null);

	// What the user sees in the textarea:
	const value = dirty ? draft : formatted;

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const v = e.target.value;
		if (!dirty) setDirty(true);
		setDraft(v);
		setParseError(null);
	};

	const commit = useCallback(() => {
		const sourceText = dirty ? draft : formatted; // commit whatever is visible
		try {
			const nextGraph = convertAdjListWrapper(sourceText); // text -> A
			setGraphData(nextGraph); // update canonical A
			setDirty(false); // switch back to projection view
			setParseError(null);
			toast({
				title: 'Success',
				description: 'Graph updated',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
		} catch (e: unknown) {
			setParseError((e as Error).message ?? 'Invalid adjacency list');
			toast({
				title: 'Parse error',
				description: (e as Error).message ?? 'Invalid adjacency list',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	}, [dirty, draft, formatted, setGraphData, toast]);

	useEffect(() => {
		const handleCtrlS = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 's') {
				event.preventDefault();
				commit();
			}
		};
		window.addEventListener('keydown', handleCtrlS);
		return () => window.removeEventListener('keydown', handleCtrlS);
	}, [commit]);

	return (
		<Box bg="#1e1e2e" color="#cdd6f4" borderRadius="8px" width="100%">
			<Textarea
				placeholder="Enter adjacency list here"
				value={value}
				onChange={onChange}
				minHeight="300px"
				fontFamily="Menlo, monospace"
			/>
			{parseError && (
				<Box mt={2} color="tomato" fontSize="sm">
					{parseError}
				</Box>
			)}
			<HStack m={3}>
				<Button onClick={commit}>Parse</Button>
				{dirty && (
					<Button
						variant="outline"
						onClick={() => {
							setDirty(false);
							setParseError(null);
						}}
					>
						Revert changes
					</Button>
				)}
			</HStack>
		</Box>
	);
};

const BinaryTreeEditor = () => {
	const { graphData, setGraphData } = useGraphDataContext();
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

const GraphEditor = () => {
	const { mode } = useMode();

	return <>{mode == 'bst' ? <BinaryTreeEditor /> : <AdjacencyListEditor />}</>;
};

export default GraphEditor;
