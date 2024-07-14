import { Box, experimentalStyled as styled } from '@mui/material';

export const AppRoot = styled(Box)`
  display: flex;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;
