import React from 'react';

import { BottomNavigation } from '@mui/material';

import useSelectIntent from '../../../../hooks/useSelectIntent';
import { usePsalmsBooksData } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';
import { PsalmsContentMobileFooterWrapper, StyledBottomNavigationAction } from '../styled';

import BottomNavigationItem from './BottomNavigationItem';

const PsalmsContentMobileFooter = () => {
  const { psalmsBooksData, currentPsalmBook, handlePsalmsBookSelect } = usePsalmsBooksData();
  const { softSelected, setSoftSelected } = useSelectIntent({
    hardSelected: currentPsalmBook?.id,
    setHardSelected: handlePsalmsBookSelect,
  });

  return (
    <PsalmsContentMobileFooterWrapper>
      {psalmsBooksData && (
        <BottomNavigation
          showLabels
          value={softSelected}
          onChange={(event, newValue) => {
            setSoftSelected(newValue);
          }}
        >
          {[...psalmsBooksData]
            .sort((a, b) => Number(!!b.isFavourite) - Number(!!a.isFavourite))
            .map(({ id, name, iconSrc, isFavourite, psalmsCount }) => (
              <StyledBottomNavigationAction
                key={id}
                value={id}
                sx={psalmsCount ? undefined : { minWidth: 0, maxWidth: 0, padding: 0, opacity: 0 }}
                icon={<BottomNavigationItem name={name} isFavourite={!!isFavourite} iconSrc={iconSrc ?? undefined} />}
              />
            ))}
        </BottomNavigation>
      )}
    </PsalmsContentMobileFooterWrapper>
  );
};

export default PsalmsContentMobileFooter;
