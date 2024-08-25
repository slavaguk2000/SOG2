import React, { useEffect } from 'react';

import useSelectIntent from '../../../hooks/useSelectIntent';
import { usePsalmsBooksData } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';

import PsalmBookItem from './PsalmBookItem';
import PsalmBooksContextMenuProvider from './PsalmBooksContextMenuProvider';
import { PsalmBookSelectWrapper } from './styled';

interface PsalmBookSelectProps {
  isCurrentBookFavouriteState: boolean;
  setIsCurrentBookFavourite: (isFavourite: boolean) => void;
}

const PsalmBookSelect = ({ setIsCurrentBookFavourite, isCurrentBookFavouriteState }: PsalmBookSelectProps) => {
  const { psalmsBooksData, currentPsalmBook, handlePsalmsBookSelect } = usePsalmsBooksData();
  const { softSelected, setSoftSelected } = useSelectIntent({
    hardSelected: currentPsalmBook?.id,
    setHardSelected: handlePsalmsBookSelect,
  });

  useEffect(() => {
    const realIsFavouriteState = !!currentPsalmBook?.isFavourite;

    if (realIsFavouriteState !== isCurrentBookFavouriteState) {
      setIsCurrentBookFavourite(realIsFavouriteState);
    }
  }, [currentPsalmBook?.isFavourite, isCurrentBookFavouriteState, setIsCurrentBookFavourite]);

  return (
    <PsalmBookSelectWrapper>
      <PsalmBooksContextMenuProvider>
        {psalmsBooksData?.map((data) => (
          <PsalmBookItem
            psalmsBookData={data}
            key={data.id}
            selected={softSelected === data.id}
            onClick={() => data.id && setSoftSelected(data.id)}
          />
        ))}
      </PsalmBooksContextMenuProvider>
    </PsalmBookSelectWrapper>
  );
};

export default PsalmBookSelect;
