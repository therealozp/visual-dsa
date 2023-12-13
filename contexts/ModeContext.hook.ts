import { useContext } from 'react';
import { ModeContext } from './ModeContext';

export const useMode = () => {
	const { mode, setMode } = useContext(ModeContext);
	return { mode, setMode };
};
