import { BottomNavigationAction, Box, ListItem, styled } from '@mui/material';

export const PsalmsContentMobileWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
`;

export const PsalmsContentMobileHeaderWrapper = styled(Box)`
  display: block;
`;

export const PsalmsContentMobileFooterWrapper = styled(Box)`
  display: flex;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  height: 5rem;

  & > div {
    width: 100%;
    height: 100%;
  }
`;

export const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  &.Mui-selected {
    background: #fff3;

    & > div {
      justify-content: flex-end;

      & > p {
        display: none;
      }

      & > div {
        transform: scale(1.2) translate(0, -12px);
      }
    }
  }
`;

export const BottomNavigationItemWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
  width: 100%;
  height: 100%;
  padding: 5px;

  & > p {
    width: 100%;
    text-overflow: ellipsis;
  }

  & > div {
    transition: transform 0.3s ease-out;
  }
`;

export const PsalmsListWrapper = styled(Box)`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

export const StyledListItem = styled(ListItem)`
  height: 100%;
  width: 100%;
`;
