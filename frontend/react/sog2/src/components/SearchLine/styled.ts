import { Box, experimentalStyled as styled } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

export const SearchLineWrapper = styled(Box)`
  display: flex;
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
`;

export const SearchLineAutocomplete = styled(Autocomplete)`
  .MuiOutlinedInput-root {
    padding: 9px;
  }
`;

export const SearchLineAutocompleteItemWrapper = styled(Box)`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 1px 0 0;
  padding: 0 4px;

  :hover {
    background: ${({ theme }) => theme.palette.action.hover};
  }
`;
