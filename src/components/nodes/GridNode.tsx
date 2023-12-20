import { Box } from '@chakra-ui/react';
import React from 'react';

interface GridNodeProps {
	row: number;
	column: number;
	sideLength: number;
	className?: string;
	isStart?: boolean;
	isEnd?: boolean;
	visited?: boolean;
	id: string;
	onMouseEnter?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
	onMouseUp?: (e: React.MouseEvent) => void;
	onMouseLeave?: (e: React.MouseEvent) => void;
}

const GridNode = ({
	sideLength,
	className,
	id,
	onMouseEnter,
	onMouseDown,
	onMouseUp,
	onMouseLeave,
}: GridNodeProps) => {
	return (
		<Box
			id={id}
			className={`${className}`}
			height={`${sideLength}px`}
			width={`${sideLength}px`}
			margin="1px"
			borderRadius="sm"
			// border={'1px solid black'}
			// transition={'all 0.2s ease-in-out'}
			onMouseEnter={onMouseEnter}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseLeave}
		/>
	);
};

const MemoizedGridNode = React.memo(GridNode);

export default MemoizedGridNode;
