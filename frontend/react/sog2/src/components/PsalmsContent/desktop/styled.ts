import { Box, IconButton, styled } from '@mui/material';

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
  min-width: 50px;
  max-width: 50px;
  padding: 0;
`;

export const PsalmSelectWrapper = styled(PsalmsEntitySelectWrapper)`
  max-width: 400px;

  & > ul {
    padding: 0;
    margin: 0;

    & > li {
      position: relative;
    }
  }
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

export const StyledIconButton = styled(IconButton)`
  width: 34px;
`;
