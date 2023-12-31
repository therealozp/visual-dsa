import { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { bfs } from '../../algorithms/bfs';
import { dijkstra } from '../../algorithms/dijkstra';
import { backtrack } from '../../utils/gridHelperFunctions';
import MemoizedGridNode from '../nodes/GridNode';
import { Grid, GridLocation, GridNode } from '../interfaces/grid.interfaces';

const rowCount = 30;
const columnCount = 50;

const initializeGrid = (
	numRows: number,
	numCols: number
	// startNode: GridLocation,
	// endNode: GridLocation
) => {
	const rows = [];
	for (let i = 0; i < numRows; i++) {
		const squaresPerRow = [];
		for (let j = 0; j < numCols; j++) {
			squaresPerRow.push({
				row: i,
				column: j,
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
	const isVisualizationFinished = useRef(false);
	const isMouseDown = useRef(false);
	const draggingStart = useRef(false);
	const draggingEnd = useRef(false);
	const obstacles = useRef<GridLocation[]>([]);

	const grid = useRef(initializeGrid(rowCount, columnCount));

	const resetGridStyles = () => {
		for (let i = 0; i < rowCount; i++) {
			for (let j = 0; j < columnCount; j++) {
				const node = grid.current[i][j];
				const nodeElement = document.getElementById(
					`node-${node.row}-${node.column}`
				);
				if (nodeElement) {
					nodeElement.classList.remove('node-visited');
					nodeElement.classList.remove('node-visited-unanimated');
					nodeElement.classList.remove('node-shortest-path');
				}
			}
		}
	};

	const resetGrid = () => {
		window.location.reload();
	};

	const instantVisualizeAlgorithm = (
		algorithm: (
			grid: Grid,
			startNode: GridLocation,
			endNode: GridLocation
		) => GridNode[],
		startPos?: GridLocation,
		endPos?: GridLocation
	) => {
		if (isVisualizationFinished.current === false) return;

		resetGridStyles();
		grid.current = initializeGrid(rowCount, columnCount);
		applyBatchObstacles();

		// inProgress.current = true;
		const currentStartNode = startPos ? startPos : startNode; // Store the current start node
		const currentEndNode = endPos ? endPos : endNode; // Store the current end node

		const visitedNodes: GridNode[] = algorithm(
			grid.current,
			currentStartNode, // Use the stored start node
			currentEndNode // Use the stored end node
		);

		const shortestPath: GridNode[] = backtrack(
			visitedNodes[visitedNodes.length - 1],
			currentEndNode // Use the stored end node
		);

		for (let i = 0; i < visitedNodes.length; i++) {
			const node = visitedNodes[i];
			document
				.getElementById(`node-${node.row}-${node.column}`)
				?.classList.add('node-visited-unanimated');
		}

		for (let j = 0; j < shortestPath.length; j++) {
			const node = shortestPath[j];
			document
				.getElementById(`node-${node.row}-${node.column}`)
				?.classList.add('node-shortest-path');
		}

		// inProgress.current = false;
	};

	const visualizeAlgorithm = (
		algorithm: (
			grid: Grid,
			startNode: GridLocation,
			endNode: GridLocation
		) => GridNode[]
	) => {
		grid.current = initializeGrid(rowCount, columnCount);
		applyBatchObstacles();

		isVisualizationFinished.current = false;
		inProgress.current = true;
		const visitedNodes: GridNode[] = algorithm(
			grid.current,
			startNode,
			endNode
		);
		const shortestPath: GridNode[] = backtrack(
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

		const totalDuration = visitedNodes.length * 10 + shortestPath.length * 50;
		setTimeout(() => {
			inProgress.current = false;
			isVisualizationFinished.current = true;
			console.log(isVisualizationFinished.current);
		}, totalDuration);
	};

	const visualizeBFS = () => {
		visualizeAlgorithm(bfs);
		// console.log(isVisualizationFinished.current);
	};

	const visualizeDijkstra = () => {
		visualizeAlgorithm(dijkstra);
		// console.log(isVisualizationFinished.current);
	};

	const handleCreateWall = (row: number, column: number) => {
		if (
			!inProgress.current &&
			isMouseDown.current &&
			!(row == startNode.row && column == startNode.column) &&
			!(row == endNode.row && column == endNode.column) &&
			!grid.current[row][column].obstacle
		) {
			obstacles.current.push({ row, column });
			document
				.getElementById(`node-${row}-${column}`)
				?.classList.add('node-obstacle');
		}
	};

	const applyBatchObstacles = () => {
		obstacles.current.forEach((obstacle) => {
			grid.current[obstacle.row][obstacle.column].obstacle = true;
		});
	};

	const handleMouseDown = (row: number, column: number) => {
		if (!inProgress.current) {
			isMouseDown.current = true;
			if (row === startNode.row && column === startNode.column) {
				draggingStart.current = true;
				document.addEventListener('mousemove', handleStartNodeDrag);
			} else if (row === endNode.row && column === endNode.column) {
				draggingEnd.current = true;
				document.addEventListener('mousemove', handleEndNodeDrag);
			}
		}
	};

	const handleMouseUp = () => {
		isMouseDown.current = false;
		if (draggingStart.current) {
			draggingStart.current = false;
			// console.log('removing event listener');
			document.removeEventListener('mousemove', handleStartNodeDrag);
		}
		if (draggingEnd.current) {
			draggingEnd.current = false;
			document.removeEventListener('mousemove', handleEndNodeDrag);
		}
		console.log('mouse released');
	};

	const handleOnMouseEnter = (row: number, column: number) => {
		if (isMouseDown.current && !draggingStart.current && !draggingEnd.current) {
			handleCreateWall(row, column);
		}
	};

	const handleSetStartNode = (row: number, column: number) => {
		if (!inProgress.current) {
			// Remove 'node-visited' class from previous start node
			// const prevStartNode = grid.current[startNode.row][startNode.column];
			// if (prevStartNode) {
			// 	document
			// 		.getElementById(`node-${prevStartNode.row}-${prevStartNode.column}`)
			// 		?.classList.remove('node-visited');
			// }
			setStartNode({ row, column });
		}
	};

	const handleSetEndNode = (row: number, column: number) => {
		if (!inProgress.current) {
			// Remove 'node-visited' class from previous end node
			// const prevEndNode = grid.current[endNode.row][endNode.column];
			// if (prevEndNode) {
			// 	document
			// 		.getElementById(`node-${prevEndNode.row}-${prevEndNode.column}`)
			// 		?.classList.remove('node-visited');
			// }

			setEndNode({ row, column });
			// console.log(obstacles.current.length);
		}
	};

	const handleStartNodeDrag = (event: MouseEvent) => {
		event.preventDefault();
		if (draggingStart.current == false) return;
		const node = document.elementFromPoint(event.clientX, event.clientY);
		if (node) {
			const id = node.id;
			const match = id.match(/node-(\d+)-(\d+)/);
			if (match) {
				const row = parseInt(match[1]);
				const column = parseInt(match[2]);
				if (isVisualizationFinished.current) {
					// console.log('instant vis called');
					instantVisualizeAlgorithm(bfs, { row, column });
				} else {
					handleSetStartNode(row, column);
				}
			}
		}
	};

	const handleEndNodeDrag = (event: MouseEvent) => {
		event.preventDefault();
		if (draggingEnd.current == false) return;
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
		<Box onMouseUp={handleMouseUp}>
			<HStack>
				<Button onClick={visualizeBFS} disabled={inProgress.current}>
					Visualize BFS
				</Button>
				<Button onClick={visualizeDijkstra} disabled={inProgress.current}>
					Visualize Dijkstra's
				</Button>
				<Button onClick={resetGrid} disabled={inProgress.current}>
					Reset Grid
				</Button>
				<Button onClick={() => console.log(startNode, endNode)}>
					Display Start and End
				</Button>
			</HStack>
			{grid.current.map((row, index) => (
				<Flex key={`row-${index}`}>
					{row.map((square) => (
						<MemoizedGridNode
							id={`node-${square.row}-${square.column}`}
							key={`node-${square.row}-${square.column}`}
							row={square.row}
							column={square.column}
							sideLength={25}
							className={`node ${square.obstacle ? 'node-obstacle' : ''} ${
								square.row === startNode.row &&
								square.column === startNode.column
									? 'node-start'
									: ''
							} ${
								square.row === endNode.row && square.column === endNode.column
									? 'node-end'
									: ''
							} ${square.visited ? '' : 'node-unvisited'}`}
							visited={square.visited}
							onMouseDown={() => handleMouseDown(square.row, square.column)}
							onMouseEnter={() => handleOnMouseEnter(square.row, square.column)}
						/>
					))}
				</Flex>
			))}
		</Box>
	);
};

export default PathfinderGrid;
