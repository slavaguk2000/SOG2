import { v4 as uuidv4 } from 'uuid';

import { PsalmData } from '../../../utils/gql/types';

interface ImplementUnlinkChordProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementUnlinkChord = ({ setNewChordsData, chordsData }: ImplementUnlinkChordProps) => {
  const handleUnlinkChord = (coupletContentId: string) => {
    setNewChordsData({
      id: chordsData.id,
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => ({
        ...couplet,
        coupletContent: couplet.coupletContent.map((coupletContentItem) => {
          if (coupletContentItem.id === coupletContentId) {
            return {
              ...coupletContentItem,
              chord: {
                ...coupletContentItem.chord,
                id: uuidv4(),
              },
            };
          }

          return coupletContentItem;
        }),
      })),
    });
  };

  return { handleUnlinkChord };
};

export default implementUnlinkChord;
