import { Box, experimentalStyled as styled } from '@mui/material';

export const InstrumentsFieldWrapper = styled(Box)`
  display: flex;
`;

export const AudioPlayerWrapper = styled(Box)`
  display: flex;
  margin: 10px;
  height: 40px;
  width: 90vw;
  align-items: center;

  & > p {
    white-space: nowrap;
    margin: 0 0 0 10px;
  }
`;
