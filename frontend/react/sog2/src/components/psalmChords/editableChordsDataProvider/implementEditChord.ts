import { CoupletContentChord, PsalmData } from '../../../utils/gql/types';

interface ImplementEditChordProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementEditChord = ({ setNewChordsData, chordsData }: ImplementEditChordProps) => {
  const handleEditChord = (chord: CoupletContentChord) => {
    setNewChordsData({
      id: chordsData.id,
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => ({
        ...couplet,
        coupletContent: couplet.coupletContent.map((coupletContentItem) => {
          if (coupletContentItem.chord.id === chord.id) {
            return {
              ...coupletContentItem,
              chord,
            };
          }

          return coupletContentItem;
        }),
      })),
    });
  };

  return { handleEditChord };
};

export default implementEditChord;
