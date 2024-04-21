import { Box, experimentalStyled as styled } from '@mui/material';

export const HeaderWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.background.default};
  z-index: 100;
  padding: 5px;
`;

export const HeaderRowWrapper = styled(Box)`
  display: flex;
`;

export const SearchFieldWrapper = styled(Box)`
  display: flex;
  width: 100%;
`;
