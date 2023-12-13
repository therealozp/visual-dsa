import Viewer from './components/layouts/Viewer';
import { ModeContextProvider } from '../contexts/ModeContext';

const App = () => {
	return (
		<ModeContextProvider>
			<Viewer />
		</ModeContextProvider>
	);
};

export default App;
