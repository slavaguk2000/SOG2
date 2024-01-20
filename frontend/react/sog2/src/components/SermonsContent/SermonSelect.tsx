import React, { useMemo } from 'react';

import { useSermonData } from '../../providers/sermanDataProvider';
import BibleEntityItem from '../BibleContent/BibleEntityItem';

import { SermonSelectWrapper } from './styled';

const SermonsSelect = () => {
  const { sermonsData, handleSermonSelect, currentSermonId } = useSermonData();

  const preparedData = useMemo(
    () =>
      sermonsData?.map(({ id, name, translation, date }) => {
        const sermonDate = new Date(date);

        const year = sermonDate.getFullYear().toString().substr(-2); // Получаем последние две цифры года
        const month = (sermonDate.getMonth() + 1).toString().padStart(2, '0'); // Получаем месяц и добавляем ведущий ноль, если нужно
        const day = sermonDate.getDate().toString().padStart(2, '0'); // Получаем день и добавляем ведущий ноль, если нужно

        return { id, name: `${year}-${month}${day} ${name} (${translation})` };
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
          selected={id === currentSermonId}
        />
      ))}
    </SermonSelectWrapper>
  );
};

export default SermonsSelect;
