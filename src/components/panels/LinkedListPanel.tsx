import { useState } from 'react';
import { Flex, Button, Stack, Text, Input, Checkbox } from '@chakra-ui/react';
import { useGraphDataContext } from '../../../contexts/GraphDataContext';

const LinkedListPanel = () => {
	const { graphData, setGraphData: _setGraphData } = useGraphDataContext();
	// _setGraphData is intentionally read from context for future operations
	// and currently unused in this panel. Keep for consistency.
	void _setGraphData;
	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const [atTail, setAtTail] = useState(false);
	// TODO: implement handleInsertHead and handleInsertTail
	const handleInsertHead = () => {
		console.log('hello');
	};
	const handleInsertTail = () => {
		console.log('hello');
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
				{atTail ? (
					<Stack spacing={2}>
						<Text>insert at tail</Text>
						<Input
							type="string"
							value={target}
							onChange={(e) => setTarget(e.target.value)}
							placeholder="new tail"
							disabled={graphData.nodes.length === 0}
						/>
					</Stack>
				) : (
					<Stack spacing={2}>
						<Text>insert at head</Text>
						<Input
							type="string"
							value={source}
							onChange={(e) => setSource(e.target.value)}
							placeholder="new head"
						/>
					</Stack>
				)}

				<Checkbox
					isDisabled={graphData.nodes.length === 0}
					checked={atTail}
					onChange={() => {
						setAtTail(!atTail);
						// console.log(isRightChild);
					}}
				>
					insert at tail?
				</Checkbox>
				<Button
					colorScheme="teal"
					variant={'outline'}
					width="100px"
					onClick={atTail ? handleInsertTail : handleInsertHead}
				>
					add node
				</Button>
			</Stack>
		</Flex>
	);
};

export default LinkedListPanel;
