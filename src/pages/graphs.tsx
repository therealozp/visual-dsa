import Viewer from '.././components/layouts/Viewer';
import { ModeContextProvider } from '../../contexts/ModeContext';

const GraphsPage = () => {
	return (
		<ModeContextProvider>
			<Viewer />
		</ModeContextProvider>
	);
};

export default GraphsPage;
