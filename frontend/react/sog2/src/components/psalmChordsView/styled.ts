import { Box, styled } from '@mui/material';

export const PsalmChordsViewWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
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
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  gap: 2%;
`;

export const PsalmChordsViewCoupletWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
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
`;
