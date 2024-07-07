import React from 'react';

import useSelectIntent from '../../../hooks/useSelectIntent';
import { usePsalmsSelectionData } from '../../../providers/dataProviders/psalmsDataProvider';
import { usePsalmsBooksData } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';

import PsalmBookItem from './PsalmBookItem';
import { PsalmBookSelectWrapper } from './styled';

const PsalmBookSelect = () => {
  const { psalmsBooksData, currentPsalmBook } = usePsalmsBooksData();
  const { handlePsalmsBookSelect } = usePsalmsSelectionData();
  const { softSelected, setSoftSelected } = useSelectIntent({
    hardSelected: currentPsalmBook?.id,
    setHardSelected: handlePsalmsBookSelect,
    timeout: 100,
  });

  return (
    <PsalmBookSelectWrapper>
      {psalmsBooksData?.map((data) => (
        <PsalmBookItem
          psalmsBookData={data}
          key={data.id}
          selected={softSelected === data.id}
          onClick={() => data.id && setSoftSelected(data.id)}
        />
      ))}
    </PsalmBookSelectWrapper>
  );
};

export default PsalmBookSelect;
