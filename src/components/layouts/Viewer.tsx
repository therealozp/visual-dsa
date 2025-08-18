import { useEffect, useRef, useState, useMemo } from 'react';

import { Flex, Grid, VStack } from '@chakra-ui/react';
import Wrapper from './Wrapper';

import { ForceGraph2D } from 'react-force-graph';
import { useMode } from '../../../contexts/ModeContext.hook';

import { GraphPanel } from '../panels/NodesPanel';
import { BinaryTreePanel } from '../panels/BinaryTreePanel';
import LinkedListPanel from '../panels/LinkedListPanel';
import ModesPanel from '../panels/ModesPanel';
import GraphEditor from '../panels/GraphEditor';

import {
	defaultUndirectedGraphData,
	defaultDirectedGraphData,
	defaultBinaryTreeData,
	defaultWeightedGraphData,
	defaultLinkedListData,
} from '../../utils/dummyGraphData';
// import { GraphData } from '../interfaces/graph.interfaces';
import { useGraphDataContext } from '../../../contexts/GraphDataContext';
import { GraphData } from '../interfaces/graph.interfaces';
import { normalizeGraph } from '../../utils/graphUtils';

const Viewer = () => {
	const { graphData, setGraphData } = useGraphDataContext();

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	const { mode } = useMode();

	const boundingBoxRef = useRef<HTMLDivElement>(null);
	const updateDimensions = () => {
		// get the width of the screen
		setWidth(boundingBoxRef.current?.clientWidth ?? 0);
		setHeight(boundingBoxRef.current?.clientHeight ?? 0);
	};

	useEffect(() => {
		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		// remove so no memory leaks
		return () => window.removeEventListener('resize', updateDimensions);
	}, []);

	// factory pattern avoids accidental reuse
	const defaultsByMode: Record<string, () => GraphData> = {
		undir_g: () => normalizeGraph(defaultUndirectedGraphData),
		dir_g: () => normalizeGraph(defaultDirectedGraphData),
		bst: () => normalizeGraph(defaultBinaryTreeData),
		linked_list: () => normalizeGraph(defaultLinkedListData),
		heap: () => normalizeGraph(defaultBinaryTreeData),
		weighted_g: () => normalizeGraph(defaultWeightedGraphData),
	};

	useEffect(() => {
		const make = defaultsByMode[mode] ?? defaultsByMode.undir_g;
		setGraphData(make()); // new object every time
	}, [mode, setGraphData]);

	const graphForForce = useMemo(() => {
		// deep clone so the forceGraph can mutate safely.
		const g = normalizeGraph(graphData);
		// structuredClone is supported in modern browsers; fallback to JSON if needed.
		return typeof structuredClone === 'function'
			? structuredClone(g)
			: JSON.parse(JSON.stringify(g));
	}, [graphData]);

	const scaleMultiplier = 0.3;
	const textScaleMultiplier = 0.2;
	return (
		<Wrapper>
			<Grid>
				<Flex
					width={'100vw'}
					height={'100vh'}
					alignItems={'center'}
					justifyContent={'center'}
					ref={boundingBoxRef}
				>
					<ForceGraph2D
						graphData={graphForForce}
						width={width}
						height={height}
						backgroundColor="#181825"
						linkColor={() => '#fff'}
						nodeCanvasObjectMode={() => 'replace'}
						linkDirectionalArrowLength={
							mode == 'dir_g' || mode == 'linked_list' ? 3.5 : 0
						}
						linkCurvature={mode == 'dir_g' ? 0.25 : 0}
						dagMode={mode == 'bst' ? 'td' : undefined}
						dagLevelDistance={20}
						// dagMode="null"
						nodeCanvasObject={(node, ctx, globalScale) => {
							if (node.x === undefined || node.y === undefined) return;
							const label = String(node.id ?? '');
							const baseFontSize = 16;
							const fontSize =
								baseFontSize * Math.log(globalScale) * textScaleMultiplier;
							ctx.font = `${fontSize}px Sans-Serif`;
							const textWidth = ctx.measureText(label).width;
							const baseRadius = 10;
							const compRadius =
								baseRadius * Math.log(globalScale) * scaleMultiplier;
							const radius = Math.max(compRadius, textWidth);
							// Draw the circle
							ctx.beginPath();
							ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
							ctx.fillStyle = 'rgba(48, 144, 242, 0.9)';
							ctx.fill();

							// Draw the text
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillStyle = '#000';
							ctx.fillText(label, node.x, node.y);

							node.__dimensions = { r: radius };
						}}
						nodePointerAreaPaint={(node, color, ctx) => {
							if (node.x === undefined || node.y === undefined) return;
							ctx.fillStyle = color;
							const dims = node.__dimensions;
							dims && ctx.beginPath();
							dims && ctx.arc(node.x, node.y, dims.r, 0, 2 * Math.PI, false);
							dims && ctx.fill();
						}}
					/>
				</Flex>
				<Flex
					position={'absolute'}
					left={8}
					top={20}
					flexDir="column"
					justify="center"
					alignItems="center"
					border="2px solid rgb(205, 214, 244, 0.6)"
					borderRadius="8px"
					cursor={'grab'}
				>
					{/* <DragHandleIcon color={'white'} fontSize={16} m={4} /> */}
					<ModesPanel />
				</Flex>

				<Flex
					cursor={'grab'}
					position="absolute"
					right={4}
					top={20}
					flexDir="column"
					justify="center"
					alignItems="center"
					border="2px solid rgb(205, 214, 244, 0.6)"
					borderRadius="8px"
				>
					{/* <DragHandleIcon color={'white'} fontSize={16} m={4} /> */}
					<VStack m={4} spacing={4}>
						{mode == 'bst' ? (
							<BinaryTreePanel />
						) : mode == 'linked_list' ? (
							<LinkedListPanel />
						) : (
							<GraphPanel />
						)}
					</VStack>
				</Flex>
				<Flex
					position="absolute"
					right={4}
					bottom={20}
					flexDir="column"
					justify="center"
					alignItems="center"
					border="2px solid rgb(205, 214, 244, 0.6)"
					borderRadius="8px"
					cursor={'grab'}
					width={'400px'}
				>
					{/* <DragHandleIcon
						color={editorDraggable ? 'white' : 'red'}
						fontSize={16}
						m={4}
					/> */}
					<GraphEditor />
				</Flex>
			</Grid>
		</Wrapper>
	);
};

export default Viewer;
