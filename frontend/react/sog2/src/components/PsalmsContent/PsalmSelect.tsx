import React, { useMemo } from 'react';

import { usePsalmsData } from '../../providers/dataProviders/psalmsDataProvider';

import PsalmSelectItem from './PsalmSelectItem';
import { PsalmSelectWrapper } from './styled';

const PsalmSelect = () => {
  const { psalmsData, handlePsalmSelect, currentPsalm } = usePsalmsData();

  const preparedData = useMemo(
    () =>
      psalmsData?.map(({ id, name, psalmNumber, defaultTonality, inFavourite }) => {
        return {
          id,
          name: `${psalmNumber ? `${psalmNumber} ` : ''}${name}${defaultTonality ? ` (${defaultTonality})` : ''}`,
          inFavourite,
        };
      }),
    [psalmsData],
  );

  return (
    <PsalmSelectWrapper>
      {preparedData?.map(({ name, id, inFavourite }) => (
        <PsalmSelectItem
          key={id}
          psalmName={name}
          selected={id === currentPsalm?.id}
          onClick={() => handlePsalmSelect(id)}
          psalmId={id}
          inFavourite={inFavourite ?? undefined}
        />
      ))}
    </PsalmSelectWrapper>
  );
};

export default PsalmSelect;
