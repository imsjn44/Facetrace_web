import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main:'#fff',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });
  
export default theme;
