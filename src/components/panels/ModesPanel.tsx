import { Flex, Select } from '@chakra-ui/react';

const ModesPanel = () => {
	return (
		<Flex
			// width="100%"
			// height="200px"
			bg="#1e1e2e"
			color="#cdd6f4"
			p={3}
			border="2px solid rgb(205, 214, 244, 0.6)"
			borderRadius={'8px'}
		>
			<Select placeholder="select mode">
				<option value="undir_g">undirected graph</option>
				<option value="dir_g">directed graph</option>
				<option value="bst">binary tree</option>
				<option value="linked_list">linked list</option>
				<option value="stack">stack</option>
				<option value="queue">queue</option>
				<option value="heap">heap</option>
			</Select>
		</Flex>
	);
};

export default ModesPanel;
