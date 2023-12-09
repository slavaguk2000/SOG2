import { Box, experimentalStyled as styled, Typography } from '@mui/material';

export const HistoryInstrumentIconWrapper = styled(Box)`
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HistoryContentWrapper = styled(Box)`
  max-width: 60vw;
  max-height: 60vh;
  min-width: 100px;
`;

export const EllipsisTypography = styled(Typography)`
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;
