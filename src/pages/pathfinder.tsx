import { Flex } from '@chakra-ui/react';
// import PathfinderGrid from '../components/layouts/PathfinderGrid';
import PathfinderGridReplace from '../components/layouts/PathfinderGridReplaceClass';
import Wrapper from '../components/layouts/Wrapper';

const Pathfinder = () => {
	return (
		<Wrapper>
			<Flex alignItems={'center'} justifyContent={'center'} h={'100%'}>
				<PathfinderGridReplace />
			</Flex>
		</Wrapper>
	);
};

export default Pathfinder;
