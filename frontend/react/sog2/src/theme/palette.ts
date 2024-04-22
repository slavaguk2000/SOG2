import { lightBlue } from '@mui/material/colors';
import { PaletteOptions } from '@mui/material/styles/createPalette';

export const palette: PaletteOptions = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#017',
  },
  secondary: {
    main: '#E0C2FF',
    light: '#F5EBFF',
    dark: '#5525c0',
    contrastText: '#47008F',
  },
  background: {
    paper: '#24a',
    default: '#cef',
  },
  action: {
    hover: '#9ef',
    selected: '#4af',
    focus: lightBlue[100],
  },
};
