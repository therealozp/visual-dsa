import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Define your color palette
const colors = {
	dark: {
		background: '#181825',
		text: '#cdd6f4',
	},
	light: {
		background: '#f4f6f8', // example light mode background
		text: '#333333', // example light mode text
	},
};

// Define the default styles for light and dark mode
const styles = {
	global: (props: { colorMode: string }) => ({
		body: {
			bg:
				props.colorMode === 'dark'
					? colors.dark.background
					: colors.light.background,
			color: props.colorMode === 'dark' ? colors.dark.text : colors.light.text,
		},
		option: {
			bg:
				props.colorMode === 'dark'
					? colors.dark.background
					: colors.light.background,
			color: props.colorMode === 'dark' ? colors.dark.text : colors.light.text,
		},
	}),
};

// Configure the initial color mode and how to toggle between modes
const config: ThemeConfig = {
	initialColorMode: 'system',
	useSystemColorMode: false,
};

const theme = extendTheme({ config, styles, colors });

export default theme;
