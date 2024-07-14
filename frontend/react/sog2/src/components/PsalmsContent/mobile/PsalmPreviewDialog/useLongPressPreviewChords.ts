import { TouchEvent } from 'react';

import { useLongPress } from '@uidotdev/usehooks';

import { usePsalmsContentMobileContext } from '../PsalmsContentMobileContextProvider';

interface UseLongPressPreviewChordsProps {
  psalmId?: string;
  transposition: number;
}

const useLongPressPreviewChords = ({ psalmId, transposition }: UseLongPressPreviewChordsProps) => {
  const { setPreviewChordsPsalmData } = usePsalmsContentMobileContext();

  return useLongPress(
    (e: Event) => {
      const touch = (e as unknown as TouchEvent).touches?.[0];

      if (psalmId) {
        setPreviewChordsPsalmData({
          psalmData: {
            id: psalmId,
            transposition,
          },
          position: touch
            ? {
                x: touch.clientX,
                y: touch.clientY,
              }
            : undefined,
        });
      }
    },
    {
      threshold: 500,
    },
  );
};

export default useLongPressPreviewChords;
