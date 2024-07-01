import React from 'react';

import useSelectIntent from '../../../hooks/useSelectIntent';
import { usePsalmsData } from '../../../providers/dataProviders/psalmsDataProvider';

import PsalmBookItem from './PsalmBookItem';
import { PsalmBookSelectWrapper } from './styled';

const PsalmBookSelect = () => {
  const { psalmsBooksData, currentPsalmBook, handlePsalmBookSelect } = usePsalmsData();
  const { softSelected, setSoftSelected } = useSelectIntent({
    hardSelected: currentPsalmBook?.id,
    setHardSelected: handlePsalmBookSelect,
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
