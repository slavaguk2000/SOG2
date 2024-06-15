import { v4 as uuidv4 } from 'uuid';

import { CoupletContent, CoupletContentChord, PsalmData } from '../../../utils/gql/types';

interface ImplementAddChordProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementAddChord = ({ setNewChordsData, chordsData }: ImplementAddChordProps) => {
  const handleAddChord = (
    coupletId: string,
    coupletContentId: string,
    charPosition: number,
    chord: CoupletContentChord,
  ) => {
    setNewChordsData({
      id: chordsData.id,
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => {
        if (couplet.id === coupletId) {
          return {
            ...couplet,
            coupletContent: couplet.coupletContent.reduce((acc: CoupletContent[], coupletContentItem) => {
              if (
                coupletContentItem.id === coupletContentId &&
                charPosition > 0 &&
                charPosition < coupletContentItem.text.length - 1
              ) {
                acc.push({ ...coupletContentItem, text: coupletContentItem.text.slice(0, charPosition) });
                acc.push({
                  ...coupletContentItem,
                  text: coupletContentItem.text.slice(charPosition),
                  chord,
                  id: uuidv4(),
                });
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

  return { handleAddChord };
};

export default implementAddChord;
