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

type SearchLineAutocompleteItemWrapperProps = {
  selected: boolean;
};

export const SearchLineAutocompleteItemWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<SearchLineAutocompleteItemWrapperProps>`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 1px 0 0;
  padding: 0 4px;
  background: ${({ theme, selected }) => (selected ? theme.palette.action.hover : 'none')};
  cursor: pointer;

  * > .highlighted {
    background: ${({
      theme: {
        palette: {
          primary: { light },
        },
      },
    }) => light};
    font-weight: bold;
    border-radius: 3px;
    box-shadow: ${({
        theme: {
          palette: {
            primary: { main },
          },
        },
      }) => main}
      3 3 5;
    padding: 3px;
  }
`;
