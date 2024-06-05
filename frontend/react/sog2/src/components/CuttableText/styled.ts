import { styled } from '@mui/material';

export const CuttableTextChar = styled('span')`
  cursor: none;

  &:hover {
    padding: 0 0 0 10px;

    & > span {
      border-left: 1px solid #00f3;
    }
  }
`;
