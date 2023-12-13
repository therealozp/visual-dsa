import { Box, Flex, Image, Text } from '@chakra-ui/react';

interface WrapperProps {
	children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
	return (
		<Box minH={'100%'} width={'100%'} background="#181825">
			<Flex
				width="100%"
				height="64px"
				padding={4}
				alignItems={'center'}
				as="nav"
			>
				<Image src="/image.png" alt="logo" height={12} width={12} />
				<Text
					fontSize="2xl"
					fontWeight="bold"
					color="white"
					marginLeft={4}
					fontFamily="monospace"
				>
					the last dsa visualizer you will ever need
				</Text>
			</Flex>
			{children}
		</Box>
	);
};

export default Wrapper;
