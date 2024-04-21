import { Box, experimentalStyled as styled } from '@mui/material';

export const SlideWithPreviewWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
`;

export const SlidePreviewWrapper = styled(Box)`
  display: flex;
  background-color: ${({ theme }) => theme.palette.background.paper};
  overflow-y: scroll;
  max-height: 50vh;
  opacity: 0.85;
  position: relative;
  border-radius: 6px;
  border: solid 1px #ffffffbb;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.5);
`;

export const SlidePreviewContainer = styled(Box)`
  display: flex;
  padding: 2px;
`;

export const SlidePreviewText = styled(Box)`
  display: flex;
  font-family: 'Arial', 'sans-serif';
  text-align: center;
  color: ${({ theme }) => theme.palette.common.white};
`;

export const SlidePreviewViewBox = styled(Box)`
  display: flex;
  background-color: ${({ theme }) => theme.palette.primary.light};
  position: absolute;
  opacity: 0.7;
  transition: top 0.3s ease-out;
`;
