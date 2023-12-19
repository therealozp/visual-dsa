import { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { bfs, instantBfs } from '../../algorithms/bfs';
import { dijkstra } from '../../algorithms/dijkstra';
import { backtrack } from '../../utils/gridHelperFunctions';
import MemoizedGridNode from '../nodes/GridNode';
import { Grid, GridLocation, GridNode } from '../interfaces/grid.interfaces';

const rowCount = 30;
const columnCount = 50;

const initializeGrid = (rowCount: number, columnCount: number) => {
	const grid: Grid = [];
	for (let row = 0; row < rowCount; row++) {
		const currentRow: GridNode[] = [];
		for (let column = 0; column < columnCount; column++) {
			const nodeElement = document.querySelector(`#node-${row}-${column}`);
			const node: GridNode = {
				row,
				column,
				distance: Infinity,
				visited: false,
				obstacle: false,
				prev: null,
				nodeElement, // Store the node element
			};
			currentRow.push(node);
		}
		grid.push(currentRow);
	}
	return grid;
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
				const nodeElement = node.nodeElement;
				if (nodeElement) {
					nodeElement.classList.remove(
						'node-visited',
						'node-shortest-path',
						'node-visited-unanimated'
					);
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

		const visitedNodes = algorithm(
			grid.current,
			currentStartNode,
			currentEndNode
		);
		const shortestPath = backtrack(
			visitedNodes[visitedNodes.length - 1],
			currentEndNode
		);

		for (let i = 0; i < visitedNodes.length; i++) {
			const node = visitedNodes[i];
			node.nodeElement?.classList.add('node-visited-unanimated');
		}

		for (let j = 0; j < shortestPath.length; j++) {
			const node = shortestPath[j];
			node.nodeElement?.classList.add('node-shortest-path');
		}
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
				// document.addEventListener('mousemove', handleStartNodeDrag);
			} else if (row === endNode.row && column === endNode.column) {
				draggingEnd.current = true;
				// document.addEventListener('mousemove', handleEndNodeDrag);
			}
		}
	};

	const handleMouseUp = () => {
		isMouseDown.current = false;
		if (draggingStart.current) {
			draggingStart.current = false;
			// console.log('removing event listener');
			// document.removeEventListener('mousemove', handleStartNodeDrag);
		}
		if (draggingEnd.current) {
			draggingEnd.current = false;
			// document.removeEventListener('mousemove', handleEndNodeDrag);
		}
		console.log('mouse released');
	};

	const handleOnMouseEnter = (row: number, column: number) => {
		if (isMouseDown.current && !draggingStart.current && !draggingEnd.current) {
			handleCreateWall(row, column);
		} else if (isMouseDown.current && draggingStart.current) {
			handleStartNodeDrag(row, column);
		} else if (isMouseDown.current && draggingEnd.current) {
			handleEndNodeDrag(row, column);
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

	const handleStartNodeDrag = (row: number, column: number) => {
		if (draggingStart.current == false) return;
		if (isVisualizationFinished.current) {
			instantVisualizeAlgorithm(bfs, { row, column });
		} else {
			handleSetStartNode(row, column);
		}
	};

	const handleEndNodeDrag = (row: number, column: number) => {
		if (draggingEnd.current == false) return;
		if (isVisualizationFinished.current) {
			instantVisualizeAlgorithm(bfs, undefined, { row, column });
		} else {
			handleSetEndNode(row, column);
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
							className={`${
								square.obstacle
									? 'node-obstacle'
									: square.row === startNode.row && // eslint-disable-next-line no-mixed-spaces-and-tabs
										  square.column === startNode.column
										? 'node-start'
										: square.row === endNode.row && // eslint-disable-next-line no-mixed-spaces-and-tabs
											  square.column === endNode.column
											? 'node-end'
											: 'node'
							}`}
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
