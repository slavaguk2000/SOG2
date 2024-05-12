import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Box, experimentalStyled as styled } from '@mui/material';

export const AudioMappingControllerWrapper = styled(Box)`
  display: flex;
  gap: 5px;
  margin: 0 0 0 5px;

  & > button {
    min-width: 0;
    border-radius: 30%;
  }
`;

export const BlinkedRadioButtonCheckedIcon = styled(RadioButtonCheckedIcon)`
  @keyframes scaleAnimation {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.2);
    }
  }

  animation-name: ${({ color }) => (color === 'error' ? 'scaleAnimation' : 'none')};
  animation-duration: 0.7s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;
