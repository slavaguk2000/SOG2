import { Theme } from '@mui/material';
import { ComponentsOverrides } from '@mui/material/styles/overrides';

import { palette } from '../palette';

export const MuiAutocomplete: {
  styleOverrides: ComponentsOverrides<Theme>['MuiAutocomplete'];
} = {
  styleOverrides: {
    listbox: {
      padding: '0',
    },
    root: {
      padding: '0',
    },
    paper: {
      background: palette.background?.default,
    },
    popper: {
      boxShadow: '0 4px 9px rgba(0, 0, 0, 0.5)',
    },
  },
};
