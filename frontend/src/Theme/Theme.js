import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      xsm: 300,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: "#0d66e4",
      mainBgS1: "#f1f2f4",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: "Jost",
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    // MuiListItemButton: {
    //   styleOverrides: {
    //     root: {
    //       "&:hover": {
    //         backgroundColor: "transparent",
    //       },
    //     },
    //   },
    // },
  },
});

export default Theme;
