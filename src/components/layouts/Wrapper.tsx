import { Box } from '@chakra-ui/react';

interface WrapperProps {
	children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
	return (
		<Box minH={'100%'} width={'100%'} background="#181825">
			{children}
		</Box>
	);
};

export default Wrapper;
