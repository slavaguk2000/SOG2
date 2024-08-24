import ShortcutIcon from '@mui/icons-material/Shortcut';
import UTurnLeftIcon from '@mui/icons-material/UTurnLeft';
import { Box, Button, styled } from '@mui/material';

export const PsalmChordsViewWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px 3%;
  background: white;
  color: black;
  user-select: none;
`;

export const PsalmChordsViewTitleWrapper = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 0 0 20px;
`;

export const PsalmChordsViewContentWrapper = styled(Box)`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

export const PsalmChordsViewCoupletWrapper = styled(Box, {
  shouldForwardProp(propName: PropertyKey) {
    return !(['hoverable', 'styling'] as PropertyKey[]).includes(propName);
  },
})<{ hoverable: boolean; styling?: number }>`
  ${({ styling }) =>
    styling
      ? `
          font-weight: bold;
          font-style: italic;
        `
      : ''}

  ${({ hoverable }) =>
    hoverable
      ? `
          & > div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          
          &:hover {
            border-radius: 20px;
            background-color: #adf3;
            padding: 0 7px;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
            font-weight: bold;
            font-style: italic;
          }
        `
      : `
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        `}
}
`;

interface ChordWrapperProps {
  contentFontSize?: number;
  isChordDeleting?: boolean;
  nonDeletable?: boolean;
  isChordEditing?: boolean;
  isLinkSourceChordChoosing?: boolean;
  isCopySourceChordChoosing?: boolean;
  isCurrentChordLinking?: boolean;
  isSameChordLinking?: boolean;
  isDestinationChordChoosing?: boolean;
  isChordMoving?: boolean;
  isCurrentChordMoving?: boolean;
}

export const ChordWrapper = styled('span', {
  shouldForwardProp(propName: PropertyKey) {
    return !(
      [
        'contentFontSize',
        'isChordDeleting',
        'isChordEditing',
        'nonDeletable',
        'isLinkSourceChordChoosing',
        'isCopySourceChordChoosing',
        'isCurrentChordLinking',
        'isDestinationChordChoosing',
        'isSameChordLinking',
        'isChordMoving',
        'isCurrentChordMoving',
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

  ${({
    isChordEditing,
    isLinkSourceChordChoosing,
    isDestinationChordChoosing,
    isCopySourceChordChoosing,
    isChordMoving,
    isCurrentChordMoving,
  }) =>
    isChordEditing ||
    isLinkSourceChordChoosing ||
    isDestinationChordChoosing ||
    isCopySourceChordChoosing ||
    (isChordMoving && !isCurrentChordMoving)
      ? `
      &:hover {
        cursor: ${isChordMoving ? 'ew-resize' : 'pointer'};
        scale: 1.2;
        ${isDestinationChordChoosing ? 'color: #37f;' : ''}
      }
  `
      : ''}

  ${({ contentFontSize }) => (contentFontSize === undefined ? '' : `top: -${contentFontSize * 0.75}px;`)}

  ${({ nonDeletable, isChordDeleting }) => (nonDeletable && isChordDeleting ? `opacity: 0.3;` : '')}

  ${({ isSameChordLinking, isCurrentChordLinking, isCurrentChordMoving }) =>
    isSameChordLinking || isCurrentChordMoving
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

export const GlueWithNextLineIcon = styled(UTurnLeftIcon)`
  transform: rotate(90deg);
`;

export const TextContentEditingField = styled('input', {
  shouldForwardProp(propName: PropertyKey) {
    return !(['fontSize', 'width'] as PropertyKey[]).includes(propName);
  },
})<{ fontSize?: number }>`
  font-family: 'Times New Roman', sans-serif;
  ${({ fontSize }) => (fontSize ? `font-size: ${fontSize}px` : '')};
  padding: 8.5px 5px;
  border-radius: 10px;
  max-width: 90vw;
  width: ${({ width }) => width}px;
`;

export const ClickableSpan = styled('span', {
  shouldForwardProp(propName: PropertyKey) {
    return !(['clickable'] as PropertyKey[]).includes(propName);
  },
})<{ clickable?: boolean }>`
  ${({ clickable }) =>
    clickable
      ? `
    cursor: pointer;
    
    &:hover {
      border-radius: 5px;
      background-color: #adf;
    }
  `
      : ''}
`;
