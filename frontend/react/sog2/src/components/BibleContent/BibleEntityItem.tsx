import React, { PropsWithChildren, useEffect, useRef } from 'react';

import { Tooltip } from '@mui/material';

import { BibleEntityItemWrapper } from './styled';

export interface BibleEntityItemProps extends PropsWithChildren {
  name: string;
  onClick: () => void;
  selected: boolean;
  preSelected?: boolean;
  tooltip?: string;
  scrollingOrder?: number;
}

const BibleEntityItem = ({
  name,
  onClick,
  selected,
  preSelected,
  tooltip,
  children,
  scrollingOrder,
}: BibleEntityItemProps) => {
  const itemRef = useRef(null);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (selected && itemRef.current) {
        (itemRef.current as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 200 + (Math.random() + (scrollingOrder ?? Math.random() * 5)) * 200);

    return () => clearTimeout(timerId);
  }, [scrollingOrder, selected]);

  const body = (
    <BibleEntityItemWrapper
      component="div"
      selected={selected}
      onClick={onClick}
      ref={itemRef}
      preSelected={preSelected}
    >
      {children}
      {name}
    </BibleEntityItemWrapper>
  );

  return tooltip ? <Tooltip title={tooltip}>{body}</Tooltip> : body;
};

export default BibleEntityItem;
