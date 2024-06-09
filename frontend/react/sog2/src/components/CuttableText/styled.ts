import { styled } from '@mui/material';

export const CuttableTextChar = styled('span')`
  cursor: none;

  &:hover {
    padding: 0 0 0 3px;

    & > span {
      border-left: 3px dashed #00f3;
    }
  }
`;
