import React, { CSSProperties } from 'react';

import { useSermonData } from '../../../providers/dataProviders/sermanDataProvider';
import { useSermons } from '../../../providers/dataProviders/sermanDataProvider/SermonsProvider';
import BibleEntityItem from '../../BibleContent/BibleEntityItem';
import { StyledListItem } from '../styled';

interface PsalmsListItemProps {
  index: number;
  style: CSSProperties;
}

const PsalmsListItem = ({ index, style }: PsalmsListItemProps) => {
  const { handleSermonSelect, currentSermon: selectedSermon } = useSermonData();

  const { preparedSermons } = useSermons();

  const currentSermon = preparedSermons?.[index];

  return currentSermon ? (
    <StyledListItem disablePadding style={style}>
      <BibleEntityItem
        name={currentSermon.name}
        onClick={() => handleSermonSelect(currentSermon.id)}
        selected={currentSermon.id === selectedSermon?.id}
        scrollingOrder={1}
        fixedTwoLines
      />
    </StyledListItem>
  ) : null;
};

export default PsalmsListItem;
