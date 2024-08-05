import { RefObject, useEffect } from 'react';
import { VariableSizeList } from 'react-window';

import { useItemsData } from './Providers/ItemsDataProvider';

interface ScrollerToSelectedItemProps {
  listRef: RefObject<VariableSizeList | null>;
}

const ScrollerToSelectedItem = ({ listRef }: ScrollerToSelectedItemProps) => {
  const { selected } = useItemsData();

  useEffect(() => {
    if (selected !== undefined && listRef.current) {
      listRef.current?.scrollToItem(selected, 'center');
    }
  }, [selected, listRef]);

  return null;
};

export default ScrollerToSelectedItem;
