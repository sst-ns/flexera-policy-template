// src/theme/index.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8A2BE2",
      light: "#9370DB",
      dark: "#5E2B97",
      contrastText: "#fff",
    },
    secondary: {
      main: "#DDA0DD",
      contrastText: "#663399",
    },
    success: {
      main: "#0F9D58", // GCP green
      contrastText: "#fff",
    },
    warning: {
      main: "#FF9900", // AWS orange
      contrastText: "#fff",
    },
    info: {
      main: "#0078D4", // Azure blue
      contrastText: "#fff",
    },
    background: {
      default: "#FAFBFC",
      paper: "#fff",
    },
    text: {
      // primary: "#663399",
      // secondary: "#9370DB",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: "none",
    //       boxShadow: "none",
    //     },
    //     containedPrimary: {
    //       backgroundColor: "#8A2BE2",
    //       "&:hover": {
    //         backgroundColor: "#7C3AED",
    //       },
    //     },
    //   },
    // },
    // MuiCheckbox: {
    //   styleOverrides: {
    //     root: {
    //       color: "#8A2BE2",
    //       "&.Mui-checked": {
    //         color: "#8A2BE2",
    //       },
    //     },
    //   },
    // },
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       "& fieldset": {
    //         borderColor: "#9370DB",
    //       },
    //       "&:hover fieldset": {
    //         borderColor: "#9370DB",
    //       },
    //       "&.Mui-focused fieldset": {
    //         borderColor: "#9370DB",
    //         // boxShadow: "0 0 5px #8A2BE2",
    //       },
    //     },
    //   },
    // },
  },
});

export default theme;
