import React, { useMemo } from 'react';

import { usePsalmsData } from '../../providers/dataProviders/psalmsDataProvider';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { PsalmSelectWrapper } from './styled';

const PsalmSelect = () => {
  const { psalmsData, handlePsalmSelect, currentPsalms } = usePsalmsData();

  const preparedData = useMemo(
    () =>
      psalmsData?.map(({ id, name, psalmNumber, defaultTonality }) => {
        return {
          id,
          name: `${psalmNumber ? `${psalmNumber} ` : ''}${name}${defaultTonality ? ` (${defaultTonality})` : ''}`,
        };
      }),
    [psalmsData],
  );

  return (
    <PsalmSelectWrapper>
      {preparedData?.map(({ name, id }) => (
        <BibleEntityItem
          key={id}
          name={name}
          onClick={() => handlePsalmSelect(id)}
          selected={id === currentPsalms?.id}
        />
      ))}
    </PsalmSelectWrapper>
  );
};

export default PsalmSelect;
