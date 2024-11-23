import { Flex, Select, Text } from '@chakra-ui/react';
import { useMode } from '../../../contexts/ModeContext.hook';

const ModesPanel = () => {
	const { mode, setMode } = useMode();
	return (
		<Flex
			width="100%"
			// height="200px"
			bg="#1e1e2e"
			color="#cdd6f4"
			p={3}
			borderRadius={'8px'}
			flexDir={'column'}
		>
			<Text mb={2} fontSize={'lg'}>
				select mode
			</Text>
			<Select onChange={(e) => setMode(e.target.value)} value={mode}>
				<option value="undir_g">undirected graph</option>
				<option value="dir_g">directed graph</option>
				<option value="bst">binary tree</option>
				<option value="linked_list">linked list</option>
				<option value="heap">heap</option>
			</Select>
		</Flex>
	);
};

export default ModesPanel;
