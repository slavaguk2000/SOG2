import { Box, experimentalStyled as styled } from '@mui/material';

export const SlideWithPreviewWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
`;

export const SlidePreviewWrapper = styled(Box)`
  display: flex;
  box-sizing: content-box;
  overflow: hidden auto;
  background-color: ${({ theme }) => theme.palette.background.paper};
  max-height: 50vh;
  opacity: 0.85;
  position: relative;
  border-radius: 6px;
  border: solid 1px #ffffffbb;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease-out;
  min-height: 10px;
`;

export const SlidePreviewContainer = styled(Box)`
  display: flex;
  justify-content: center;
`;

export const SlidePreviewText = styled(Box)`
  display: flex;
  line-height: 1.1;
  font-family: 'Arial', 'sans-serif';
  text-align: center;
  color: ${({ theme }) => theme.palette.common.white};
`;

export const SlidePreviewViewBox = styled(Box, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'smoothScrolling';
  },
})<{ smoothScrolling: boolean }>`
  display: flex;
  background-color: ${({ theme }) => theme.palette.primary.light};
  position: absolute;
  opacity: 0.4;
  ${({ smoothScrolling }) => (smoothScrolling ? 'transition: top 0.3s ease-out;' : '')}
`;

export const OverlayIndicator = styled(Box, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'visible';
  },
})<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? '0.95' : '0')};
  width: 100%;
  background-color: #54f5f7;
  position: absolute;
  transition: opacity 0.3s ease-out;
`;
