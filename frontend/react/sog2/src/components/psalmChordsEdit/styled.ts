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
  gap: 40px;
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
}

export const ChordWrapper = styled('span', {
  shouldForwardProp(propName: PropertyKey) {
    return !(['contentFontSize', 'isChordDeleting'] as PropertyKey[]).includes(propName);
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
  transition: color ease-in 1s;

  ${({ isChordDeleting, nonDeletable }) =>
    isChordDeleting && !nonDeletable
      ? `
      &:hover {
        text-decoration: line-through red;
        cursor: none;
        color: red;
      }
  `
      : ''}

  ${({ contentFontSize }) => contentFontSize && `top: -${contentFontSize * 0.75}px;`}
  
  ${({ nonDeletable, isChordDeleting }) => (nonDeletable && isChordDeleting ? `opacity: 0.3;` : '')}
`;

export const ChordAndContentWrapper = styled('span')`
  position: relative;
  vertical-align: sub;
  font-family: 'Times New Roman', sans-serif;
`;

export const SelectableButton = styled(Button, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'selected';
  },
})<{ selected: boolean }>`
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
