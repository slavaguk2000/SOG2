import { Box, styled } from '@mui/material';

export const FullSpaceSlideWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: min(0.5vh, 0.5vw);
  box-sizing: border-box;
  background: black;
`;

export const ContentWrapper = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  overflow: auto;

  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const TitleWrapper = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
`;
