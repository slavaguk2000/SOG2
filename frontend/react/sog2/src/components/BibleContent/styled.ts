import { Box, ButtonBase, ButtonBaseProps, experimentalStyled as styled } from '@mui/material';

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

interface BibleEntityItemProps extends ButtonBaseProps {
  selected: boolean;
  preSelected?: boolean;
  fixTwoLines: boolean;
}

export const BibleEntityItemWrapper = styled(ButtonBase, {
  shouldForwardProp: (prop) => !(['selected', 'preSelected', 'fixTwoLines'] as PropertyKey[]).includes(prop),
})<BibleEntityItemProps>`
  ${({ fixTwoLines }) =>
    fixTwoLines
      ? `
        & > span {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          line-clamp: 2;
        }
      `
      : ''}

  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
