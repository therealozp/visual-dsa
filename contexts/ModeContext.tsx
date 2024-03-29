import { createContext, useState, Dispatch, SetStateAction } from 'react';

const ModeContext = createContext<{
	mode: string;
	setMode: Dispatch<SetStateAction<string>>;
}>({
	mode: '',
	setMode: () => {},
});

interface ModeContextProviderProps {
	children: React.ReactNode;
}

const ModeContextProvider = ({ children }: ModeContextProviderProps) => {
	const [mode, setMode] = useState('undir_g');
	return (
		<ModeContext.Provider value={{ mode, setMode }}>
			{children}
		</ModeContext.Provider>
	);
};

export { ModeContext, ModeContextProvider };
