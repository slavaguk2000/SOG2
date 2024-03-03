import { Box, experimentalStyled as styled } from '@mui/material';

export const SermonsContentWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

export const SermonsEntitySelectWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
`;

export const SermonSelectWrapper = styled(SermonsEntitySelectWrapper)`
  width: 250px;
`;

export const SermonChapterSelectWrapper = styled(SermonsEntitySelectWrapper)`
  width: 100%;
`;

type SermonsEntityItemProps = {
  selected: boolean;
  preSelected?: boolean;
};

export const SermonsEntityItemWrapper = styled(Box, {
  shouldForwardProp: (prop) => !(['selected', 'preSelected'] as PropertyKey[]).includes(prop),
})<SermonsEntityItemProps>`
  display: flex;
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
