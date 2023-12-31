import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import GraphsPage from './pages/graphs.tsx';
import Pathfinder from './pages/pathfinder.tsx';
import theme from './theme/theme.ts';
import './globals.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
	{ path: '/', element: <GraphsPage /> },
	{ path: '/pathfinder', element: <Pathfinder /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<RouterProvider router={router} />
		</ChakraProvider>
	</React.StrictMode>
);
