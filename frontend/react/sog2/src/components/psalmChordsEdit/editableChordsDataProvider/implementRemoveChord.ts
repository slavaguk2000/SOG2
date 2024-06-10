import { CoupletContent, PsalmData } from '../../../utils/gql/types';

interface ImplementRemoveChordProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementRemoveChord = ({ setNewChordsData, chordsData }: ImplementRemoveChordProps) => {
  const handleRemoveChord = (coupletId: string, coupletContentId: string) => {
    setNewChordsData({
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => {
        if (couplet.id === coupletId) {
          return {
            ...couplet,
            coupletContent: couplet.coupletContent.reduce((acc: CoupletContent[], coupletContentItem) => {
              if (coupletContentItem.id === coupletContentId && acc.length) {
                const prevCoupletContent = acc[acc.length - 1];

                if (prevCoupletContent.line === coupletContentItem.line) {
                  prevCoupletContent.text += coupletContentItem.text;
                }

                return acc;
              }

              acc.push({ ...coupletContentItem });

              return acc;
            }, []),
          };
        }

        return couplet;
      }),
    });
  };

  return { handleRemoveChord };
};

export default implementRemoveChord;
