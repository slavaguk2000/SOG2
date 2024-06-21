import { Dispatch, SetStateAction } from 'react';

import { PsalmData } from '../../../utils/gql/types';

interface ImplementCoupletHighlightingProps {
  setNewChordsData: Dispatch<SetStateAction<PsalmData>>;
}

const implementCoupletHighlighting = ({ setNewChordsData }: ImplementCoupletHighlightingProps) => {
  const toggleCoupletHighlighting = (coupletId: string) => {
    setNewChordsData((prev) => ({
      id: prev.id,
      psalm: prev.psalm,
      couplets: prev.couplets.map((couplet) => {
        console.log(coupletId, couplet);
        if (couplet.id === coupletId) {
          console.log(couplet.styling, Number(!couplet.styling));
          return {
            ...couplet,
            styling: Number(!couplet.styling),
          };
        }

        return couplet;
      }),
    }));
  };

  return { toggleCoupletHighlighting };
};

export default implementCoupletHighlighting;
