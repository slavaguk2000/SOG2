import React, { useMemo } from 'react';

import { useSermonData } from '../../providers/dataProviders/sermanDataProvider';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { SermonSelectWrapper } from './styled';

const SermonsSelect = () => {
  const { sermonsData, handleSermonSelect, currentSermon } = useSermonData();

  const preparedData = useMemo(
    () =>
      sermonsData?.map(({ id, name, translation, date, audioMapping }) => {
        const sermonDate = new Date(date);

        const year = sermonDate.getFullYear().toString().substr(-2);
        const month = (sermonDate.getMonth() + 1).toString().padStart(2, '0');
        const day = sermonDate.getDate().toString().padStart(2, '0');

        return { id, name: `${year}-${month}${day} ${audioMapping ? '💿 ' : ''}${name} (${translation})` };
      }),
    [sermonsData],
  );

  return (
    <SermonSelectWrapper>
      {preparedData?.map(({ name, id }) => (
        <BibleEntityItem
          key={id}
          name={name}
          onClick={() => handleSermonSelect(id)}
          selected={id === currentSermon?.id}
          scrollingOrder={1}
          fixedTwoLines
        />
      ))}
    </SermonSelectWrapper>
  );
};

export default SermonsSelect;
