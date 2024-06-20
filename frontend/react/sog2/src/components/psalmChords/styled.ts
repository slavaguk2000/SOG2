import ShortcutIcon from '@mui/icons-material/Shortcut';
import { Box, Button, styled } from '@mui/material';

export const PsalmChordsViewWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px;
  background: white;
  color: black;
  user-select: none;
`;

export const PsalmChordsViewTitleWrapper = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
  text-decoration: underline;
  padding: 0 0 20px;
`;

export const PsalmChordsViewContentWrapper = styled(Box)`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

export const PsalmChordsViewCoupletWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

interface ChordWrapperProps {
  contentFontSize: number;
  isChordDeleting?: boolean;
  nonDeletable?: boolean;
  isChordEditing?: boolean;
  isSourceChordChoosing?: boolean;
  isCurrentChordLinking?: boolean;
  isSameChordLinking?: boolean;
  isDestinationChordChoosing?: boolean;
}

export const ChordWrapper = styled('span', {
  shouldForwardProp(propName: PropertyKey) {
    return !(
      [
        'contentFontSize',
        'isChordDeleting',
        'isChordEditing',
        'nonDeletable',
        'isSourceChordChoosing',
        'isCurrentChordLinking',
        'isDestinationChordChoosing',
        'isSameChordLinking',
      ] as PropertyKey[]
    ).includes(propName);
  },
})<ChordWrapperProps>`
  display: flex;
  position: absolute;
  translate: -30%;
  left: 0;
  line-height: 1;
  letter-spacing: -0.1em;
  font-style: italic;
  font-weight: bold;

  ${({ isChordDeleting, nonDeletable }) =>
    isChordDeleting && !nonDeletable
      ? `
      transition: color ease-in 1s;

      &:hover {
        text-decoration: line-through red;
        cursor: none;
        color: red;
      }
  `
      : ''}

  ${({ isChordEditing, isSourceChordChoosing, isDestinationChordChoosing }) =>
    isChordEditing || isSourceChordChoosing || isDestinationChordChoosing
      ? `
      &:hover {
        cursor: pointer;
        scale: 1.2;
        ${isDestinationChordChoosing ? 'color: #37f;' : ''}
      }
  `
      : ''}

  ${({ contentFontSize }) => contentFontSize && `top: -${contentFontSize * 0.75}px;`}

  ${({ nonDeletable, isChordDeleting }) => (nonDeletable && isChordDeleting ? `opacity: 0.3;` : '')}
  
  ${({ isSameChordLinking, isCurrentChordLinking }) =>
    isSameChordLinking
      ? `
    color: #37f;
    ${isCurrentChordLinking ? 'text-decoration: underline;' : ''}
  `
      : ''}
`;

export const ChordAndContentWrapper = styled('span', {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'hoverable';
  },
})<{ hoverable?: boolean }>`
  position: relative;
  font-family: 'Times New Roman', sans-serif;
  white-space: pre-wrap;

  ${({ hoverable }) =>
    hoverable
      ? `
    &:hover {
      border-radius: 5px;
      background-color: #adf;
      cursor: pointer;
    }
  `
      : ''}
`;

export const SelectableButton = styled(Button, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'selected';
  },
})<{ selected?: boolean }>`
  border-radius: 0;

  ${({ selected }) =>
    selected
      ? `
        background: #0000ff55;
        
        &:hover {
            background: #0000ff66;
        }
      `
      : ''}
`;

export const NewLineIcon = styled(ShortcutIcon)`
  transform: rotate(180deg);
`;

export const TextContentEditingField = styled('input', {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'fontSize';
  },
})<{ fontSize: number }>`
  font-family: 'Times New Roman', sans-serif;
  font-size: ${({ fontSize }) => fontSize}px;
  padding: 8.5px 5px;
  border-radius: 10px;
`;