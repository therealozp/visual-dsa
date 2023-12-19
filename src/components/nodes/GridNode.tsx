import { Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

interface GridNodeProps {
	row: number;
	column: number;
	sideLength: number;
	className?: string;
	isStart?: boolean;
	isEnd?: boolean;
	visited?: boolean;
	id: string;
	onMouseEnter?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
}

const GridNode = ({
	sideLength,
	className,
	id,
	onMouseEnter,
	onMouseDown,
	onMouseUp,
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
		/>
	);
};

const MemoizedGridNode = React.memo(GridNode);

export default MemoizedGridNode;
