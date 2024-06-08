import { v4 as uuidv4 } from 'uuid';

import { CoupletContent, CoupletContentChord, PsalmData } from '../../../utils/gql/types';

interface ImplementLinkChordsProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementLinkChords = ({ setNewChordsData, chordsData }: ImplementLinkChordsProps) => {
  const handleLinkChords = (
    coupletId: string,
    coupletContentId: string,
    charPosition: number,
    chord: CoupletContentChord,
  ) => {
    setNewChordsData({
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => {
        if (couplet.id === coupletId) {
          return {
            ...couplet,
            coupletContent: couplet.coupletContent.reduce((acc: CoupletContent[], coupletContentItem) => {
              if (coupletContentItem.id === coupletContentId && charPosition < coupletContentItem.text.length - 1) {
                if (charPosition > 0) {
                  acc.push({ ...coupletContentItem, text: coupletContentItem.text.slice(0, charPosition) });
                  acc.push({
                    ...coupletContentItem,
                    text: coupletContentItem.text.slice(charPosition),
                    chord,
                    id: uuidv4(),
                  });
                } else if (charPosition === 0) {
                  acc.push({
                    ...coupletContentItem,
                    chord,
                  });
                }
              } else {
                acc.push(coupletContentItem);
              }

              return acc;
            }, []),
          };
        }

        return couplet;
      }),
    });
  };

  return { handleLinkChords };
};

export default implementLinkChords;
