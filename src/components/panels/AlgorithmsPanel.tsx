import { Flex, Select, Text } from '@chakra-ui/react';

interface AlgsPanelProps {
	mode: string;
	setMode: (mode: string) => void;
	children?: React.ReactNode;
}

const AlgsPanel = ({ mode, setMode, children }: AlgsPanelProps) => {
	return (
		<Flex
			width="300px"
			// height="200px"
			bg="#1e1e2e"
			color="#cdd6f4"
			p={4}
			mr={10}
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius={'8px'}
			flexDir={'column'}
		>
			<Text mb={4}>select mode</Text>
			<Select onChange={(e) => setMode(e.target.value)} value={mode}>
				<option value="astar">a-star (A*)</option>
				<option value="dijkstra">dijkstra's</option>
				<option value="bfs">breadth-first search</option>
				<option value="gbfs">greedy breadth-first search</option>
			</Select>
			{children}
		</Flex>
	);
};

export default AlgsPanel;
