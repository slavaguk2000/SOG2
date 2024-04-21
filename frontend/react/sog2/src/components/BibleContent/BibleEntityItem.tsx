import React, { useEffect, useRef } from 'react';

import { Tooltip } from '@mui/material';

import { BibleEntityItemWrapper } from './styled';

export interface BibleEntityItemProps {
  name: string;
  onClick: () => void;
  selected: boolean;
  preSelected?: boolean;
  tooltip?: string;
}

const BibleEntityItem = ({ name, onClick, selected, preSelected, tooltip }: BibleEntityItemProps) => {
  const itemRef = useRef(null);

  useEffect(() => {
    if (selected && itemRef.current) {
      (itemRef.current as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selected]);

  const body = (
    <BibleEntityItemWrapper selected={selected} onClick={onClick} ref={itemRef} preSelected={preSelected}>
      {name}
    </BibleEntityItemWrapper>
  );

  return tooltip ? <Tooltip title={tooltip}>{body}</Tooltip> : body;
};

export default BibleEntityItem;
