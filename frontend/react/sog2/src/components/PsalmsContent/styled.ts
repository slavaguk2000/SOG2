import { Box, experimentalStyled as styled } from '@mui/material';

export const PsalmsContentWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

const PsalmsEntitySelectWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
`;

export const PsalmSelectWrapper = styled(PsalmsEntitySelectWrapper)`
  max-width: 400px;
`;

export const CoupletSelectWrapper = styled(PsalmsEntitySelectWrapper)`
  width: 100%;
`;
