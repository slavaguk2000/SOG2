import React, { useMemo } from 'react';

import { useSermonData } from '../../providers/sermanDataProvider';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { SermonSelectWrapper } from './styled';

const SermonsSelect = () => {
  const { sermonsData, handleSermonSelect, currentSermon } = useSermonData();

  const preparedData = useMemo(
    () =>
      sermonsData?.map(({ id, name, translation, date, audioLink }) => {
        const sermonDate = new Date(date);

        const year = sermonDate.getFullYear().toString().substr(-2);
        const month = (sermonDate.getMonth() + 1).toString().padStart(2, '0');
        const day = sermonDate.getDate().toString().padStart(2, '0');

        return { id, name: `${year}-${month}${day} ${audioLink ? '💿 ' : ''}${name} (${translation})` };
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
        />
      ))}
    </SermonSelectWrapper>
  );
};

export default SermonsSelect;
