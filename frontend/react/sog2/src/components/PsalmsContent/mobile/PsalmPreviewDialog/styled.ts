import { Box, styled, Dialog } from '@mui/material';

export const PsalmPreviewDialogWrapper = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: white;
  overflow: hidden;
`;

export const PsalmPreviewDialogBodyWrapper = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const StyledDialog = styled(Dialog)`
  height: 100%;

  & > div[role='presentation'] {
    height: 100%;

    & > div {
      height: 100%;

      & > div {
        max-height: 90%;
        height: 90%;
      }
    }
  }
`;
