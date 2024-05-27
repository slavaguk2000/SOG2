import React from 'react';

import { usePsalmsData } from '../../providers/dataProviders/psalmsDataProvider';

import PsalmBookItem from './PsalmBookItem';
import { PsalmBookSelectWrapper } from './styled';

const PsalmBookSelect = () => {
  const { psalmsBooksData, currentPsalmBook, handlePsalmBookSelect } = usePsalmsData();

  return (
    <PsalmBookSelectWrapper>
      {psalmsBooksData?.map((data) => (
        <PsalmBookItem
          psalmsBookData={data}
          key={data.id}
          selected={currentPsalmBook?.id === data.id}
          onClick={() => data.id && handlePsalmBookSelect(data.id)}
        />
      ))}
    </PsalmBookSelectWrapper>
  );
};

export default PsalmBookSelect;
