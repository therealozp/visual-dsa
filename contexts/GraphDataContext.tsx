import React, { createContext, useContext } from 'react';
import { GraphData } from '../src/components/interfaces/graph.interfaces';
import { defaultUndirectedGraphData } from '../src/utils/dummyGraphData';

interface GraphDataContextProviderProps {
	children: React.ReactNode;
}

interface GraphDataContextProps {
	graphData: GraphData;
	setGraphData: (data: GraphData) => void;
}

const GraphDataContext = createContext<GraphDataContextProps | null>(null);

const GraphContextProvider = ({ children }: GraphDataContextProviderProps) => {
	const [graphData, setGraphData] = React.useState<GraphData>(
		defaultUndirectedGraphData
	);
	return (
		<GraphDataContext.Provider value={{ graphData, setGraphData }}>
			{children}
		</GraphDataContext.Provider>
	);
};

const useGraphDataContext = () => {
	const context = useContext(GraphDataContext);
	if (context === null) {
		throw new Error(
			'useGraphDataContext must be used within a GraphContextProvider'
		);
	}
	return context;
};

export default GraphContextProvider;
export { useGraphDataContext };
