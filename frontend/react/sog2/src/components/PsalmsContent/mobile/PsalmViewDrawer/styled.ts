import { Box, styled } from '@mui/material';

export const PsalmViewDrawerBodyWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90vw;
  height: 100%;
  background: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;

  & > div.MuiToggleButtonGroup-root {
    gap: 10px;

    & > button.MuiButtonBase-root {
      border: none;
      border-radius: 20px;
      justify-content: flex-start;

      & > div > p {
        line-height: normal;
        text-transform: none;
        color: ${({ theme }) => theme.palette.primary.contrastText};
      }
    }
  }
`;
