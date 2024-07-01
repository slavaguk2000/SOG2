import React from 'react';

import { BottomNavigation } from '@mui/material';

import useSelectIntent from '../../../../hooks/useSelectIntent';
import { usePsalmsData } from '../../../../providers/dataProviders/psalmsDataProvider';
import { PsalmsContentMobileFooterWrapper, StyledBottomNavigationAction } from '../styled';

import BottomNavigationItem from './BottomNavigationItem';

const PsalmsContentMobileFooter = () => {
  const { psalmsBooksData, currentPsalmBook, handlePsalmBookSelect } = usePsalmsData();
  const { softSelected, setSoftSelected } = useSelectIntent({
    hardSelected: currentPsalmBook?.id,
    setHardSelected: handlePsalmBookSelect,
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
          {psalmsBooksData
            .filter(({ psalmsCount }) => !!psalmsCount)
            .map(({ id, name, iconSrc, isFavourite }) => (
              <StyledBottomNavigationAction
                key={id}
                value={id}
                icon={<BottomNavigationItem name={name} isFavourite={!!isFavourite} iconSrc={iconSrc ?? undefined} />}
              />
            ))}
        </BottomNavigation>
      )}
    </PsalmsContentMobileFooterWrapper>
  );
};

export default PsalmsContentMobileFooter;
