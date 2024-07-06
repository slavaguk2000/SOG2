import { Box } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';

type PreselectBoxProps = {
  debounceSeconds: number;
};

export const PreselectBoxContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'debounceSeconds',
})<PreselectBoxProps>`
  display: flex;
  position: absolute;
  top: 50%;
  right: 50%;
  padding: 10px 20px;
  background-color: gray;
  border-radius: 5px;
  font-size: xxx-large;
  opacity: 70%;
  box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
  z-index: 1100;

  animation: ${({ debounceSeconds }) => `fadeInOut ${debounceSeconds}s forwards`};

  @keyframes fadeInOut {
    0% {
      opacity: 100%;
    }
    50% {
      opacity: 75%;
    }
    80% {
      opacity: 50%;
    }
    100% {
      opacity: 0;
    }
  }
\`  ;
`;
