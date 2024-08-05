import { useEffect } from 'react';

import { useSermonData } from '../../../providers/dataProviders/sermanDataProvider';
import { useSermons } from '../../../providers/dataProviders/sermanDataProvider/SermonsProvider';

interface ScrollerToSelectedSermonProps {
  containerParentRef: HTMLDivElement;
  itemSize: number;
}

const ScrollerToSelectedSermon = ({ containerParentRef, itemSize }: ScrollerToSelectedSermonProps) => {
  const { currentSermon } = useSermonData();
  const { sermons } = useSermons();

  const scrollContainer = containerParentRef.children[0];
  const scrollContainerScrollHeight = scrollContainer?.scrollHeight;

  useEffect(() => {
    if (sermons && currentSermon?.id && scrollContainer) {
      const sermonIdx = sermons.findIndex(({ id }) => currentSermon?.id === id);

      if (sermonIdx >= 0) {
        scrollContainer.scrollTo({
          top: itemSize * sermonIdx - scrollContainer.clientHeight / 2,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [scrollContainerScrollHeight, currentSermon?.id, scrollContainer, itemSize, sermons]);

  return null;
};

export default ScrollerToSelectedSermon;
