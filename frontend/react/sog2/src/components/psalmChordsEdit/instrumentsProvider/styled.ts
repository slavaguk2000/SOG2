import { Box, Dialog, styled } from '@mui/material';

export const StyledDialog = styled(Dialog)`
  font-size: 24px;
  font-family: 'Times New Roman', sans-serif;
  font-weight: bold;
  font-style: italic;

  .MuiDialog-paper {
    color: #61dafb;
  }
`;

export const DialogContentWrapper = styled(Box)`
  display: flex;
  align-items: center;

  .MuiInputBase-input {
    color: #61dafb;
    font-size: 24px;
    font-family: 'Times New Roman', sans-serif;
    font-weight: bold;
    font-style: italic;
    padding: 7.5px 14px;
    width: 100px;
  }
`;
