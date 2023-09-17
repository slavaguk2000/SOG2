import React, { useEffect, useRef } from 'react';

import { BibleEntityItemWrapper } from './styled';

interface BibleEntityItemProps {
  name: string;
  onClick: () => void;
  selected: boolean;
}

const BibleEntityItem = ({ name, onClick, selected }: BibleEntityItemProps) => {
  const itemRef = useRef(null);

  useEffect(() => {
    if (selected && itemRef.current) {
      (itemRef.current as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selected]);

  return (
    <BibleEntityItemWrapper selected={selected} onClick={onClick} ref={itemRef}>
      {name}
    </BibleEntityItemWrapper>
  );
};

export default BibleEntityItem;
