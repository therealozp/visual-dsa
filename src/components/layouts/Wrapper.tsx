import { Box, Flex, Image, Text } from '@chakra-ui/react';

interface WrapperProps {
	children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
	return (
		<Box
			h="100vh"
			maxH={'100vh'}
			width={'100vw'}
			overflowY={'hidden'}
			background="#181825"
		>
			<Flex
				width="100vw"
				height="64px"
				padding={4}
				alignItems={'center'}
				as="nav"
				position={'fixed'}
				zIndex={99}
				background="#181825"
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
				<Box width="10vw" />
				<Text marginRight={'16px'}>
					<a
						href="/"
						style={{
							color: 'white',
							marginLeft: 'auto',
							fontSize: '1.2rem',
							textDecoration: 'underline',
						}}
					>
						visualizer
					</a>
				</Text>

				<Text>
					<a
						href="/pathfinder"
						style={{
							color: 'white',
							marginLeft: 'auto',
							fontSize: '1.2rem',
							textDecoration: 'underline',
						}}
					>
						pathfinder
					</a>
				</Text>
			</Flex>
			<Box height="calc(100vh + 32px)">{children}</Box>
		</Box>
	);
};

export default Wrapper;
