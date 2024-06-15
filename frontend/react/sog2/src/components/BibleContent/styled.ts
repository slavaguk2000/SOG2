import { Box, experimentalStyled as styled } from '@mui/material';

export const BibleContentWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
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

type BibleEntityItemProps = {
  selected: boolean;
  preSelected?: boolean;
};

export const BibleEntityItemWrapper = styled(Box, {
  shouldForwardProp: (prop) => !(['selected', 'preSelected'] as PropertyKey[]).includes(prop),
})<BibleEntityItemProps>`
  display: flex;
  align-items: center;
  padding: 2px 5px;
  width: 100%;
  border-radius: 2px;
  user-select: none;
  box-sizing: border-box;
  background: ${({
    selected,
    preSelected,
    theme: {
      palette: { action, background },
    },
  }) => (selected ? action.selected : preSelected ? action.focus : background.default)};

  :hover {
    background: ${({
      selected,
      theme: {
        palette: { action },
      },
    }) => (selected ? action.selected : action.hover)};
  }
`;
