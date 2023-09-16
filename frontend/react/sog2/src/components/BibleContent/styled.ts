import { Box, experimentalStyled as styled } from '@mui/material';

export const BibleContentWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

export const BibleEntitySelectWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
`;

export const BibleBookSelectWrapper = styled(BibleEntitySelectWrapper)`
  width: 250px;
`;

export const BibleChapterSelectWrapper = styled(BibleEntitySelectWrapper)`
  width: 50px;
`;

export const BibleVersesWrapper = styled(BibleEntitySelectWrapper)`
  width: 100%;
`;

export const BibleEntityItemWrapper = styled(Box)`
  display: flex;
  padding: 2px 5px;
  width: 100%;
  border-radius: 2px;
  user-select: none;
  box-sizing: border-box;

  :hover {
    background: beige;
  }
`;
