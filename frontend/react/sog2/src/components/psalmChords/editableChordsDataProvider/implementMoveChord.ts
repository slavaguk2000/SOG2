import { CoupletContent, PsalmData } from '../../../utils/gql/types';

interface ImplementMoveChordProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementMoveChord = ({ setNewChordsData, chordsData }: ImplementMoveChordProps) => {
  const handleMoveChord = (coupletIdx: number, coupletContentIdx: number, isLeft: boolean) => {
    setNewChordsData({
      id: chordsData.id,
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet, cIdx) => {
        if (cIdx === coupletIdx) {
          return {
            ...couplet,
            coupletContent: couplet.coupletContent.reduce((acc: CoupletContent[], coupletContentItem, ccIdx) => {
              if (ccIdx === coupletContentIdx && acc.length) {
                const prevCoupletContent = acc[acc.length - 1];

                if (isLeft) {
                  if (prevCoupletContent.text.length > 1) {
                    const lastIndex = prevCoupletContent.text.length - 1;
                    coupletContentItem = {
                      ...coupletContentItem,
                      text: `${prevCoupletContent.text[lastIndex]}${coupletContentItem.text}`,
                    };
                    prevCoupletContent.text = prevCoupletContent.text.slice(0, lastIndex);
                  }
                } else {
                  if (coupletContentItem.text.length > 1) {
                    prevCoupletContent.text = `${prevCoupletContent.text}${coupletContentItem.text[0]}`;
                    coupletContentItem = {
                      ...coupletContentItem,
                      text: coupletContentItem.text.slice(1),
                    };
                  }
                }
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

  return { handleMoveChord };
};

export default implementMoveChord;
