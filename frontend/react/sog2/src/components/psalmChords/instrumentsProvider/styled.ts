import { Box, Dialog, DialogProps, styled } from '@mui/material';

interface StyledDialogProps extends DialogProps {
  position?: {
    left: number;
    top: number;
  };
}

// 50px height, 5px margin, top offset 5 + 50 + 15 = 70px,
// left input width 30px, left offset = 5 + 30 + 65 = 100px
export const StyledDialog = styled(Dialog, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'position';
  },
})<StyledDialogProps>`
  font-size: 24px;
  font-family: 'Times New Roman', sans-serif;
  font-weight: bold;
  font-style: italic;

  .MuiDialog-paper {
    color: #61dafb;
  }

  ${({ position }) =>
    position
      ? `
        & > * > .MuiDialog-paper {
          margin: 5px;
          position: absolute;
          top: ${Math.max(0, position.top - 100)}px;
          left: ${Math.max(0, position.left - 100)}px;
        }
      `
      : ''}
`;

export const DialogContentWrapper = styled(Box)`
  display: flex;
  align-items: center;

  .MuiInputBase-input {
    color: #61dafb;
    font-size: 40px;
    font-family: 'Times New Roman', sans-serif;
    font-weight: bold;
    font-style: italic;
    padding: 7.5px 14px;
    max-width: 100px;
  }
`;
