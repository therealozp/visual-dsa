import { Box } from '@chakra-ui/react';

interface GraphEdgeProps {
	source: {
		x: number;
		y: number;
	};
	target: {
		x: number;
		y: number;
	};
}

const GraphEdge = ({ source, target }: GraphEdgeProps) => {
	// Calculate the position and angle of the line
	const dx = target.x - source.x;
	const dy = target.y - source.y;
	const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

	return (
		<Box
			position="absolute"
			borderTop="2px solid white"
			width={`${Math.sqrt(dx * dx + dy * dy)}px`}
			left={`${source.x}px`}
			top={`${source.y}px`}
			transform={`rotate(${angle}deg)`}
			transformOrigin={'0 0'}
		></Box>
	);
};

export default GraphEdge;
