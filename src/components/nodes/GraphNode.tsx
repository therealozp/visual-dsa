import { Flex } from '@chakra-ui/react';

interface GraphNodeProps {
	value: string;
}

const GraphNode = ({ value }: GraphNodeProps) => {
	const size = 64;
	return (
		<Flex
			h={`${size}px`}
			w={`${size}px`}
			border="2px solid white"
			borderRadius={`${size / 2}px`}
			color={'white'}
			justifyContent={'center'}
			alignItems={'center'}
			fontSize={'24px'}
			bg="transparent"
			position="absolute"
			left={`${x}px`}
			top={`${y}px`}
		>
			{value}
		</Flex>
	);
};

export default GraphNode;
