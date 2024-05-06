import { Box, experimentalStyled as styled } from '@mui/material';

export const AudioMappingControllerWrapper = styled(Box)`
  display: flex;
  gap: 5px;
  margin: 0 0 0 5px;

  & > button {
    min-width: 0;
    border-radius: 30%;
  }
`;
