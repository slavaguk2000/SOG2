import { Box, styled } from '@mui/material';

export const PsalmsContentWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

const PsalmsEntitySelectWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

export const PsalmBookSelectWrapper = styled(PsalmsEntitySelectWrapper)`
  width: 70px;
  padding: 0;
`;

export const PsalmSelectWrapper = styled(PsalmsEntitySelectWrapper)`
  max-width: 400px;
`;

export const CoupletSelectWrapper = styled(PsalmsEntitySelectWrapper)`
  width: 100%;
`;

interface PsalmBookItemWrapperProps {
  selected?: boolean;
}

export const PsalmBookItemWrapper = styled(Box, {
  shouldForwardProp(propName: PropertyKey) {
    return propName !== 'selected';
  },
})<PsalmBookItemWrapperProps>`
  display: flex;
  padding: 5px 0;
  width: 100%;
  justify-content: center;

  ${({
    selected,
    theme: {
      palette: { action },
    },
  }) =>
    selected
      ? `
        background-color: ${action.selected};
      `
      : `
        &:hover {
          background-color: ${action.hover};
        }
  `}
`;
