import { Box, experimentalStyled as styled } from '@mui/material';

export const InstrumentsFieldWrapper = styled(Box)`
  display: flex;
`;

export const AudioPlayerWrapper = styled(Box)`
  display: flex;
  padding: 10px;
  height: 40px;
  width: 100%;
  align-items: center;

  & > p {
    white-space: nowrap;
    margin: 0 0 0 10px;
  }

  & > button {
    min-width: 20px;
    margin: 0 15px 0 0;
    border-radius: 50%;
  }
`;
