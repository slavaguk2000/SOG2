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
};

export const BibleEntityItemWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<BibleEntityItemProps>`
  display: flex;
  padding: 2px 5px;
  width: 100%;
  border-radius: 2px;
  user-select: none;
  box-sizing: border-box;
  background: ${({
    selected,
    theme: {
      palette: { action, background },
    },
  }) => (selected ? action.selected : background.default)};

  :hover {
    background: ${({
      selected,
      theme: {
        palette: { action },
      },
    }) => (selected ? action.selected : action.hover)};
  }
`;

type VersePreselectBoxProps = {
  debounceSeconds: number;
};

export const VersePreselectBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'debounceSeconds',
})<VersePreselectBoxProps>`
  display: flex;
  position: absolute;
  top: 50%;
  right: 50%;
  padding: 10px 20px;
  background-color: gray;
  border-radius: 5px;
  font-size: xxx-large;
  opacity: 70%;
  box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);

  animation: ${({ debounceSeconds }) => `fadeInOut ${debounceSeconds}s forwards`};

  @keyframes fadeInOut {
    0% {
      opacity: 100%;
    }
    80% {
      opacity: 50%;
    }
    100% {
      opacity: 0;
    }
  }
\` ;
`;
