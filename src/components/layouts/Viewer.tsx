import { useEffect, useState, useRef } from 'react';

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
import { GraphData } from '../interfaces/graph.interfaces';

const Viewer = () => {
	const [graphData, setGraphData] = useState<GraphData>(
		defaultUndirectedGraphData
	);

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

	useEffect(() => {
		switch (mode) {
			case 'undir_g':
				setGraphData(defaultUndirectedGraphData);
				break;
			case 'dir_g':
				setGraphData(defaultDirectedGraphData);
				break;
			case 'bst':
				setGraphData(defaultBinaryTreeData);
				break;
			case 'linked_list':
				setGraphData(defaultLinkedListData);
				break;
			case 'heap':
				setGraphData(defaultBinaryTreeData);
				break;
			case 'weighted_g':
				setGraphData(defaultWeightedGraphData);
				break;
			default:
				setGraphData(defaultUndirectedGraphData);
				break;
		}
	}, [mode]);

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
						graphData={graphData}
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
							const label = node.id;
							const baseFontSize = 16; // Base font size
							const fontSize =
								baseFontSize * Math.log(globalScale) * textScaleMultiplier; // Increase font size as you zoom in
							ctx.font = `${fontSize}px Sans-Serif`;
							const textWidth = ctx.measureText(label).width;
							const baseRadius = 10; // Base radius for the nodes
							const compRadius =
								baseRadius * Math.log(globalScale) * scaleMultiplier; // Increase node size as you zoom in
							const radius = Math.max(compRadius, textWidth); // Minimum node size
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
							<BinaryTreePanel
								graphData={graphData}
								setGraphData={setGraphData}
							/>
						) : mode == 'linked_list' ? (
							<LinkedListPanel
								graphData={graphData}
								setGraphData={setGraphData}
							/>
						) : (
							<GraphPanel graphData={graphData} setGraphData={setGraphData} />
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
					<GraphEditor graphData={graphData} setGraphData={setGraphData} />
				</Flex>
			</Grid>
		</Wrapper>
	);
};

export default Viewer;
