import { Box, Flex, Grid } from '@chakra-ui/react';
import { ForceGraph2D } from 'react-force-graph';
import { useState } from 'react';
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
	const graphWidth = 1280;
	const graphHeight = 720;
	const scaleMultiplier = 0.3;
	const textScaleMultiplier = 0.2;
	return (
		<Wrapper>
			<Grid gridTemplateColumns={'2fr 5fr 0.1fr 2.5fr'} maxW={'100%'}>
				<Box>
					<ModesPanel />
				</Box>
				<Box
					border="2px solid white"
					width={'100%'}
					height={'100%'}
					borderRadius={'10px'}
					p={2}
					m={3}
				>
					<ForceGraph2D
						graphData={graphData}
						width={graphWidth}
						height={graphHeight}
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
				</Box>
				<Box />
				<Box>
					<Flex flexDirection={'column'}>
						<NodesPanel graphData={graphData} setGraphData={setGraphData} />
						<EdgesPanel graphData={graphData} setGraphData={setGraphData} />
						<GraphEditor graphData={graphData} setGraphData={setGraphData} />
					</Flex>
				</Box>
			</Grid>
		</Wrapper>
	);
};

export default Viewer;
