import { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { bfs } from '../../algorithms/bfs';
import { dijkstra } from '../../algorithms/dijkstra';
import { backtrack } from '../../utils/gridHelperFunctions';
import MemoizedGridNode from '../nodes/GridNode';
import { GridLocation } from '../interfaces/grid.interfaces';

const rowCount = 30;
const columnCount = 50;

const initializeGrid = (
	numRows: number,
	numCols: number,
	startNode: GridLocation,
	endNode: GridLocation
) => {
	const rows = [];
	for (let i = 0; i < numRows; i++) {
		const squaresPerRow = [];
		for (let j = 0; j < numCols; j++) {
			const isStartNode = i === startNode.row && j === startNode.column;
			squaresPerRow.push({
				row: i,
				column: j,
				isStart: isStartNode,
				isEnd: i === endNode.row && j === endNode.column,
				visited: false,
				obstacle: false,
				distance: Infinity,
				prev: null,
			});
		}
		rows.push(squaresPerRow);
	}
	return rows;
};

const PathfinderGrid = () => {
	const [startNode, setStartNode] = useState({ row: 7, column: 8 });
	const [endNode, setEndNode] = useState({ row: 10, column: 19 });
	const inProgress = useRef(false);
	const isMouseDown = useRef(false);
	const draggingStart = useRef(false);
	const draggingEnd = useRef(false);
	const obstacles: GridLocation[] = [];
	// const [draggingStart, setDraggingStart] = useState(false);
	// const [draggingEnd, setDraggingEnd] = useState(false);
	// const [isMouseDown, setIsMouseDown] = useState(false);

	const grid = useRef(
		initializeGrid(rowCount, columnCount, startNode, endNode)
	);
	// const [grid, setGrid] = useState(
	// 	initializeGrid(rowCount, columnCount, startNode, endNode)
	// );

	useEffect(() => {
		document.addEventListener('mouseup', () => handleMouseUp());
		return () => {
			document.removeEventListener('mouseup', () => handleMouseUp());
		};
	});

	const resetGrid = () => {
		window.location.reload();
	};

	const visualizeBFS = () => {
		grid.current = initializeGrid(rowCount, columnCount, startNode, endNode);
		applyBatchObstacles();
		inProgress.current = true;
		console.log(inProgress.current);
		const visitedNodes = bfs(grid.current, startNode, endNode);
		const shortestPath = backtrack(
			visitedNodes[visitedNodes.length - 1],
			endNode
		);

		for (let i = 0; i < visitedNodes.length; i++) {
			const node = visitedNodes[i];
			setTimeout(() => {
				document
					.getElementById(`node-${node.row}-${node.column}`)
					?.classList.add('node-visited');
			}, 10 * i);

			if (i === visitedNodes.length - 1 && shortestPath.length > 0) {
				setTimeout(() => {
					for (let j = 0; j < shortestPath.length; j++) {
						const node = shortestPath[j];
						setTimeout(() => {
							document
								.getElementById(`node-${node.row}-${node.column}`)
								?.classList.add('node-shortest-path');
						}, 50 * j);
					}
				}, 10 * i);
			}
		}

		// Calculate the total duration of all animations
		const totalDuration = visitedNodes.length * 10 + shortestPath.length * 50;
		setTimeout(() => {
			inProgress.current = false;
			console.log(inProgress.current);
		}, totalDuration);
	};

	const visualizeDijkstra = () => {
		grid.current = initializeGrid(rowCount, columnCount, startNode, endNode);
		applyBatchObstacles();
		inProgress.current = true;
		const visitedNodes = dijkstra(grid.current, startNode, endNode);
		const shortestPath = backtrack(
			visitedNodes[visitedNodes.length - 1],
			endNode
		);

		// const totaltime = visitedNodes.length * 10 + shortestPath.length * 50;
		// setInProgress(true);
		// setTimeout(() => {
		// 	setInProgress(false);
		// }, totaltime);

		for (let i = 0; i < visitedNodes.length; i++) {
			const node = visitedNodes[i];
			setTimeout(() => {
				document
					.getElementById(`node-${node.row}-${node.column}`)
					?.classList.add('node-visited');
			}, 10 * i);

			if (i === visitedNodes.length - 1 && shortestPath.length > 0) {
				setTimeout(() => {
					for (let j = 0; j < shortestPath.length; j++) {
						const node = shortestPath[j];
						setTimeout(() => {
							document
								.getElementById(`node-${node.row}-${node.column}`)
								?.classList.add('node-shortest-path');
						}, 50 * j);
					}
				}, 10 * i);
			}
		}
	};

	const handleCreateWall = (row: number, column: number) => {
		if (
			!inProgress.current &&
			isMouseDown.current &&
			grid.current[row][column].isStart === false &&
			grid.current[row][column].isEnd === false &&
			grid.current[row][column].obstacle === false
		) {
			obstacles.push({ row, column });
			document
				.getElementById(`node-${row}-${column}`)
				?.classList.add('node-obstacle');
		}
	};

	const applyBatchObstacles = () => {
		// const newGrid = [...grid];
		obstacles.forEach((obstacle) => {
			grid.current[obstacle.row][obstacle.column].obstacle = true;
		});
	};

	const handleMouseDown = (row: number, column: number) => {
		if (!inProgress.current) {
			isMouseDown.current = true;
			if (grid.current[row][column].isStart) {
				draggingStart.current = true;
				document.addEventListener('mousemove', handleStartNodeDrag);
			} else if (grid.current[row][column].isEnd) {
				draggingEnd.current = true;
				document.addEventListener('mousemove', handleEndNodeDrag);
			}
		}
	};

	const handleMouseUp = () => {
		isMouseDown.current = false;
		if (draggingStart) {
			draggingStart.current = false;
			document.removeEventListener('mousemove', handleStartNodeDrag);
		}
		if (draggingEnd) {
			draggingEnd.current = false;
			document.removeEventListener('mousemove', handleEndNodeDrag);
		}
		// if (!inProgress.current) {
		// 	applyBatchObstacles();
		// }
	};

	// Modify the onMouseEnter event handler
	const handleOnMouseEnter = (row: number, column: number) => {
		if (isMouseDown.current && !draggingStart.current && !draggingEnd.current) {
			handleCreateWall(row, column);
		}
	};

	const handleSetStartNode = (row: number, column: number) => {
		if (!inProgress.current) {
			setStartNode({ row, column });
		}
	};

	const handleSetEndNode = (row: number, column: number) => {
		if (!inProgress.current) {
			setEndNode({ row, column });
		}
	};

	const handleStartNodeDrag = (event: MouseEvent) => {
		const node = document.elementFromPoint(event.clientX, event.clientY);
		if (node) {
			const id = node.id;
			const match = id.match(/node-(\d+)-(\d+)/);
			if (match) {
				const row = parseInt(match[1]);
				const column = parseInt(match[2]);
				handleSetStartNode(row, column);
			}
		}
	};

	const handleEndNodeDrag = (event: MouseEvent) => {
		const node = document.elementFromPoint(event.clientX, event.clientY);
		if (node) {
			const id = node.id;
			const match = id.match(/node-(\d+)-(\d+)/);
			if (match) {
				const row = parseInt(match[1]);
				const column = parseInt(match[2]);
				handleSetEndNode(row, column);
			}
		}
	};

	return (
		<Box>
			<HStack>
				<Button onClick={() => visualizeBFS()} disabled={inProgress.current}>
					Visualize BFS
				</Button>
				<Button
					onClick={() => visualizeDijkstra()}
					disabled={inProgress.current}
				>
					Visualize Dijkstra's
				</Button>
				<Button onClick={() => resetGrid()} disabled={inProgress.current}>
					Reset Grid
				</Button>
				<Button
					onClick={() => {
						console.log(startNode);
						console.log(endNode);
					}}
				>
					display start and end
				</Button>
			</HStack>
			{grid.current.map((row, index) => {
				return (
					<Flex key={`row-${index}`}>
						{row.map((square) => {
							return (
								<MemoizedGridNode
									id={`node-${square.row}-${square.column}`}
									key={`node-${square.row}-${square.column}`}
									row={square.row}
									column={square.column}
									sideLength={25}
									isStart={square.isStart}
									isEnd={square.isEnd}
									className={
										`${
											square.row == startNode.row &&
											square.column == startNode.column
												? 'node-start'
												: ''
										}` +
										' ' +
										`${
											square.row == endNode.row &&
											square.column == endNode.column
												? 'node-end'
												: ''
										}` +
										' ' +
										`${square.visited ? 'node-visited' : 'node-unvisited'}`
									}
									visited={square.visited}
									onMouseDown={() => {
										handleMouseDown(square.row, square.column);
									}}
									onMouseEnter={() => {
										handleOnMouseEnter(square.row, square.column);
									}}
									// onMouseUp={() => {
									// 	handleMouseUp();
									// }}
								/>
							);
						})}
					</Flex>
				);
			})}
		</Box>
	);
};

export default PathfinderGrid;
