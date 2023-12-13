import React, {
	createContext,
	useState,
	Dispatch,
	SetStateAction,
} from 'react';

const ModeContext = createContext<{
	mode: string;
	setMode: Dispatch<SetStateAction<string>>;
}>({
	mode: '',
	setMode: () => {},
});

const ModeContextProvider = ({ children }) => {
	const [mode, setMode] = useState('undir_g');
	return (
		<ModeContext.Provider value={{ mode, setMode }}>
			{children}
		</ModeContext.Provider>
	);
};

export { ModeContext, ModeContextProvider };
