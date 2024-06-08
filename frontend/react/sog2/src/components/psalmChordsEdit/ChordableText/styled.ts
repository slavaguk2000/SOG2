import { styled } from '@mui/material';

import { ChordAndContentWrapper, ChordWrapper } from '../styled';

export const ChordableCharChordWrapper = styled(ChordWrapper, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'color';
  },
})<{ color?: string }>`
  opacity: 0;
  ${({ color }) => (color ? `color: ${color}` : '')}
`;

export const ChordableCharChordAndContentWrapper = styled(ChordAndContentWrapper, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'isChordAdding';
  },
})<{ isChordAdding?: boolean }>`
  ${({ isChordAdding }) =>
    isChordAdding
      ? ''
      : `
    &:hover {
      & > span {
        opacity: 0.4;
      }
    }
  `}
`;
