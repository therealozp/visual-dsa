import { Flex } from '@chakra-ui/react';
import PathfinderGrid from '../components/layouts/PathfinderGrid';
import Wrapper from '../components/layouts/Wrapper';

const Pathfinder = () => {
	return (
		<Wrapper>
			<Flex alignItems={'center'} justifyContent={'center'} h={'100%'}>
				<PathfinderGrid />;
			</Flex>
		</Wrapper>
	);
};

export default Pathfinder;
