import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createTheme({
	// breakpoints: {
	//   values: {
	//     xs: 0,
	//     sm: 600,
	//     md: 1024,
	//     lg: 1200,
	//     xl: 1536,
	//   },
	// },
	typography: {
		fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
		fontSize: 14,
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
		lineHeight: 1.75,
		h1: {
			fontSize: 20,
			fontFamily: `"Raleway", "Roboto", "Helvetica", "Arial", sans-serif`,
			fontWeight: 700,
		},
		h2: {
			fontSize: 20,
			fontWeight: 500,
		},
		h3: {
			fontSize: 16,
			fontWeight: 500,
		},
		h4: {
			fontSize: 14,
			fontWeight: 500,
			lineHeight: 1.75,
		},
		h5: {
			fontSize: 12,
			fontWeight: 500,
		},
		h6: {
			fontSize: 10,
			fontWeight: 500,
		},
		body1: {
			fontSize: 18,
			fontWeight: 400,
		},
		body2: {
			fontSize: 16,
			fontWeight: 400,
		},
		subtitle1: {
			fontSize: 14,
			fontWeight: 400,
		},
		subtitle2: {
			fontSize: 12,
			fontWeight: 400,
		},
		caption: {
			fontSize: 10,
			fontWeight: 400,
		},
		button: {
			textTransform: "none",
		},
	},
	palette: {
		common: {
			black: "#333333",
			white: "#FEFEFE",
		},
		primary: {
			lighter: "#C2E4FF",
			light: "#64B6F5",
			main: "#06406D",
			contrastText: "#fff",
		},
		secondary: {
			lighter: "#F1CEFF",
			light: "#B978D3",
			main: "#5A2C6D",
			contrastText: "#fff",
		},
		tertiary: {
			lighter: "#FFC6A8",
			light: "#EB6924",
			main: "#632200",
			contrastText: "#fff",
		},
		grey: {
			50: "#FFFFFF",
			100: "#DCDCDC",
			200: "#B9BABA",
			300: "#939698",
			400: "#6F7376",
			500: "#4D5154",
			600: "#333333",
		},
		success: {
			light: "#42DEB4",
			main: "#1C752C",
		},
		error: {
			main: "#D83D3D",
		},
		background: {
			default: "#fff",
		},
		text: {
			secondary: "#B9BABA",
		},
		divider: "#DCDCDC",
	},
	overrides: {
		MuiFormLabel: {
			root: {
				fontSize: "12px",
			},
		},
		MuiFormControlLabel: {
			label: {
				fontSize: "12px",
			},
		},
		MuiOutlinedInput: {
			input: {
				fontSize: "12px",
			},
		},
		MuiAutocomplete: {
			option: {
				fontSize: "12px",
			},
			noOptions: {
				fontSize: "12px",
			},
		},
		MuiCollapse: {
			hidden: {
				display: "none",
			},
			entered: {
				display: "block",
			},
		},
		MuiTooltip: {
			tooltip: {
				fontSize: "14px",
				padding: "20px",
				backgroundColor: "#333333",
				width: "157px",
				borderRadius: "8px",
			},
			arrow: {
				color: "#333333",
			},
		},
		MuiSelect: {
			select: {
				color: "#333 !important",
				"&:focus": {
					background: "#FFF !important",
					color: "#333 !important",
				},
			},
		},
		MuiBackdrop: {
			root: {
				zIndex: 1003,
			},
		},
		MuiDialog: {
			paper: {
				zIndex: 1004,
			},
		},
		MuiTableContainer: {
			root: {
				boxShadow: "1px 6px 15px rgba(0, 0, 0, 0.05)",
				borderRadius: `3px`,
				border: `1px solid #DCDCDC`,
				overflow: "hidden",
				// borderBottomWidth: 0,

				"& tbody tr:last-child td": {
					border: 0,
				},
			},
		},
		MuiTableCell: {
			// border: `1px solid #DCDCDC`,

			root: {
				padding: "13px 28px",
				borderBottom: "1px solid #DCDCDC",
				fontSize: "14px",
				lineHeight: "16px",
				fontWeight: 500,
			},
			body: {
				"&:last-child": {
					// color: '#632200 !important',

					"& span": {
						//color: '#632200 !important',
						fontWeight: "inherit",
					},
				},
				"& span": {
					fontWeight: "inherit",
				},
			},
			head: {
				// background: `rgba(90, 44, 109, 0.1)`,
				fontSize: 16,
				lineHeight: 1,
				// borderTop: '1px solid red',
				// fontWeight: 500,
				color: "#333",
				padding: "21px 16px",
			},
		},
		MuiList: {
			root: {
				border: "1px solid #06406D",
				borderRadius: "8px",
			},
		},
		MuiMenuItem: {
			root: {
				fontSize: "12px",
			},
		},
	},
});

export default theme;
