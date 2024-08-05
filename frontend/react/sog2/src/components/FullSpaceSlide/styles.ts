import { Box, styled } from '@mui/material';

export const FullSpaceSlideWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3%;
  gap: 3%;
  box-sizing: border-box;
  background: black;
`;

export const ContentWrapper = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const TitleWrapper = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
`;
