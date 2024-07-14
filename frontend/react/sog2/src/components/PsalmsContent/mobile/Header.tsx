import React, { useEffect } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

import { useInstrumentsField } from '../../../providers/instrumentsFieldProvider';

import MobileMenu from './MobileMenu';
import Search from './search';
import { PsalmsContentMobileHeaderWrapper } from './styled';

interface PsalmsContentMobileHeaderProps {
  setSearchEmpty: (empty: boolean) => void;
}

const PsalmsContentMobileHeader = ({ setSearchEmpty }: PsalmsContentMobileHeaderProps) => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const { searchText, setSearchText } = useInstrumentsField();

  const searchEmpty = !searchText;

  useEffect(() => {
    setSearchEmpty(searchEmpty);
  }, [setSearchEmpty, searchEmpty]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <PsalmsContentMobileHeaderWrapper>
      <AppBar position="static">
        <Toolbar>
          <IconButton disabled size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Search searchText={searchText} handleSearchTextChange={setSearchText} />
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              disabled
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <MobileMenu mobileMoreAnchorEl={mobileMoreAnchorEl} handleMobileMenuClose={handleMobileMenuClose} />
    </PsalmsContentMobileHeaderWrapper>
  );
};

export default PsalmsContentMobileHeader;
