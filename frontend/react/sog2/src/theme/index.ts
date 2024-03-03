import { createTheme } from '@mui/material';

import { MuiAutocomplete } from './overrides/MuiAutocomplete';
import { MuiInputLabel } from './overrides/MuiInputLabel';
import { MuiOutlinedInput } from './overrides/MuiOutlinedInput';
import MuiTab from './overrides/MuiTab';
import MuiTabs from './overrides/MuiTabs';
import { palette } from './palette';

export const theme = createTheme({
  components: {
    MuiAutocomplete,
    MuiInputLabel,
    MuiOutlinedInput,
    MuiTab,
    MuiTabs,
  },
  palette,
});
