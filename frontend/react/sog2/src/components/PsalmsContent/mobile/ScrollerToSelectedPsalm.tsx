import { useEffect } from 'react';

import { useCurrentPsalms } from '../../../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import { usePsalms } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsProvider';

interface ScrollerToSelectedPsalmProps {
  containerParentRef: HTMLDivElement;
  itemSize: number;
}

const ScrollerToSelectedPsalm = ({ containerParentRef, itemSize }: ScrollerToSelectedPsalmProps) => {
  const { psalmId } = useCurrentPsalms();
  const { psalmsData } = usePsalms();

  const scrollContainer = containerParentRef.children[0];
  const scrollContainerScrollHeight = scrollContainer?.scrollHeight;

  useEffect(() => {
    if (psalmsData && psalmId && scrollContainer) {
      const psalmIdx = psalmsData.findIndex(({ id }) => psalmId === id);

      if (psalmIdx >= 0) {
        scrollContainer.scrollTo({
          top: itemSize * psalmIdx - scrollContainer.clientHeight / 2,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [scrollContainerScrollHeight, psalmId, scrollContainer, itemSize, psalmsData]);

  return null;
};

export default ScrollerToSelectedPsalm;
