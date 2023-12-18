import { Flex } from '@chakra-ui/react';
// import PathfinderGrid from '../components/layouts/PathfinderGrid';
import PathfinderGridWithWorker from '../components/layouts/PathfinderGridWithWorker';
import Wrapper from '../components/layouts/Wrapper';

const Pathfinder = () => {
	return (
		<Wrapper>
			<Flex alignItems={'center'} justifyContent={'center'} h={'100%'}>
				<PathfinderGridWithWorker />;
			</Flex>
		</Wrapper>
	);
};

export default Pathfinder;
