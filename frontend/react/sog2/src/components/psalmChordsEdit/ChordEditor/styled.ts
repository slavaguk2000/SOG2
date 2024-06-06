import { Box, styled } from '@mui/material';

export const ChordEditorWrapper = styled(Box)`
  display: flex;
  padding: 1px 10px;
  z-index: 600;
`;

export const ChordWheelSelectorWrapper = styled(Box)<{ height: string }>`
  display: flex;
  overflow-y: scroll;
  padding: 0 5px;
  height: ${({ height }) => height};

  /* Hide scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge, and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const ChordWheelSelectorContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const ChordWheelSelectorItemWrapper = styled(Box)<{ height: string }>`
  display: flex;
  height: ${({ height }) => height};
  width: 100%;
  justify-content: center;
`;
