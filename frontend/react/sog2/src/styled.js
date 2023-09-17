import { Box, experimentalStyled as styled } from '@mui/material';

export const AppRoot = styled(Box)`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;
