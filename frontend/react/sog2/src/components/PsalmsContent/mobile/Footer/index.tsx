import React from 'react';

import { BottomNavigation } from '@mui/material';

import useSelectIntent from '../../../../hooks/useSelectIntent';
import { usePsalmsSelectionData } from '../../../../providers/dataProviders/psalmsDataProvider';
import { usePsalmsBooksData } from '../../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';
import { PsalmsContentMobileFooterWrapper, StyledBottomNavigationAction } from '../styled';

import BottomNavigationItem from './BottomNavigationItem';

const PsalmsContentMobileFooter = () => {
  const { handlePsalmsBookSelect } = usePsalmsSelectionData();
  const { psalmsBooksData, currentPsalmBook } = usePsalmsBooksData();
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
