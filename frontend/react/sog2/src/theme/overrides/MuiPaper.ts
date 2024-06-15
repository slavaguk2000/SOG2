import { palette } from '../palette';

export default {
  styleOverrides: {
    root: {
      color: palette.common?.white,
      '& > * > .MuiMenuItem-root': {
        '&:hover': {
          backgroundColor: '#0004',
        },
        '&:focus': {
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#0004',
          },
        },
      },
    },
  },
};
