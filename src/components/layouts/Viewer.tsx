import { Box, Flex, Grid, VStack, useMediaQuery } from '@chakra-ui/react';
import { ForceGraph2D } from 'react-force-graph';
import { useEffect, useState } from 'react';
import Wrapper from './Wrapper';
import { NodesPanel, EdgesPanel } from '../panels/NodesPanel';
import ModesPanel from '../panels/ModesPanel';
import GraphEditor from '../panels/GraphEditor';

const defaultGraphData = {
	nodes: [
		{ id: '1', name: '1' },
		{ id: '2', name: '2' },
		{ id: '3', name: '3' },
		{ id: '4', name: '4' },
		{ id: '5', name: '5' },
		{ id: '6', name: '6' },
	],
	links: [
		{ source: '1', target: '2' },
		{ source: '1', target: '3' },
		{ source: '2', target: '4' },
		{ source: '2', target: '5' },
		{ source: '3', target: '6' },
	],
};

const Viewer = () => {
	const [graphData, setGraphData] = useState(defaultGraphData);
	const [graphDimensions, setGraphDimensions] = useState({
		width: 720,
		height: 640,
	});

	const [isLargeScreen] = useMediaQuery('(min-width: 1560px)');
	const [isMediumScreen] = useMediaQuery('(min-width: 1024px)');
	const [isTabletScreen] = useMediaQuery('(min-width: 768px)');

	useEffect(() => {
		if (isLargeScreen) {
			setGraphDimensions({ width: 1280, height: 720 });
		} else if (isMediumScreen) {
			setGraphDimensions({ width: 1024, height: 560 });
		} else if (isTabletScreen) {
			setGraphDimensions({ width: 768, height: 480 });
		} else {
			setGraphDimensions({ width: 480, height: 480 });
		}
	}, [isLargeScreen, isMediumScreen, isTabletScreen]);

	const scaleMultiplier = 0.3;
	const textScaleMultiplier = 0.2;
	return (
		<Wrapper>
			<Grid gridTemplateColumns={'5fr 2.3fr 2.7fr'} maxW={'100%'}>
				<Flex
					border="2px solid white"
					width={graphDimensions.width + 15}
					height={graphDimensions.height + 15}
					borderRadius={'10px'}
					p={2}
					m={4}
					alignItems={'center'}
					justifyContent={'center'}
				>
					<ForceGraph2D
						graphData={graphData}
						width={graphDimensions.width}
						height={graphDimensions.height}
						backgroundColor="#181825"
						linkColor={() => '#fff'}
						nodeCanvasObjectMode={() => 'replace'}
						// dagMode="null"
						nodeCanvasObject={(node, ctx, globalScale) => {
							const label = node.name;
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
							ctx.fillStyle = color;
							const dims = node.__dimensions;
							dims && ctx.beginPath();
							dims && ctx.arc(node.x, node.y, dims.r, 0, 2 * Math.PI, false);
							dims && ctx.fill();
						}}
					/>
				</Flex>
				<Box>
					<VStack mt={4} spacing={2}>
						<ModesPanel />
					</VStack>
				</Box>
				<Box>
					<VStack m={4} spacing={4}>
						<NodesPanel graphData={graphData} setGraphData={setGraphData} />
						<EdgesPanel graphData={graphData} setGraphData={setGraphData} />
						<GraphEditor graphData={graphData} setGraphData={setGraphData} />
					</VStack>
				</Box>
			</Grid>
		</Wrapper>
	);
};

export default Viewer;
