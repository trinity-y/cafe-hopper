import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#91C07F', // green frog colour???
    },
    secondary: {
      main: '#426A5A', // idk darker green
    },
    background: {
      default: '#3A2618', // Default background for the whole app
      box: '#CDD9C7', // pale green
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
