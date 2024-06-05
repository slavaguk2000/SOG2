import { Box, Button, styled } from '@mui/material';

export const PsalmChordsViewWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px;
  background: white;
  color: black;
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

export const ChordWrapper = styled('span', {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'contentFontSize';
  },
})<{ contentFontSize: number }>`
  display: flex;
  position: absolute;
  translate: -30%;
  ${({ contentFontSize }) => contentFontSize && `top: -${contentFontSize * 0.75}px;`}
  left: 0;
  line-height: 1;
  letter-spacing: -0.1em;
  font-style: italic;
  font-weight: bold;
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
