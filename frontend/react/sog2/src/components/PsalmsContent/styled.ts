import { Box, experimentalStyled as styled } from '@mui/material';

export const PsalmsContentWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

export const PsalmSelectWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const CoupletSelectWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;
