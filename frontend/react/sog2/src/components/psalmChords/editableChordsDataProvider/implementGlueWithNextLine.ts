import { CoupletContent, PsalmData } from '../../../utils/gql/types';

interface ImplementGlueWithNextLineProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementGlueWithNextLine = ({ setNewChordsData, chordsData }: ImplementGlueWithNextLineProps) => {
  const handleGlueWithNextLine = (coupletId: string, lineNumber: number) => {
    setNewChordsData({
      id: chordsData.id,
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => {
        if (couplet.id === coupletId) {
          return {
            ...couplet,
            coupletContent: couplet.coupletContent.reduce((acc: CoupletContent[], coupletContentItem) => {
              if (
                acc.length &&
                coupletContentItem.line === lineNumber + 1 &&
                acc[acc.length - 1].chord.id === coupletContentItem.chord.id
              ) {
                acc[acc.length - 1].text = `${acc[acc.length - 1].text}${coupletContentItem.text}`;
              } else {
                acc.push({
                  ...coupletContentItem,
                  line: coupletContentItem.line > lineNumber ? coupletContentItem.line - 1 : coupletContentItem.line,
                });
              }

              return acc;
            }, []),
          };
        }

        return couplet;
      }),
    });
  };

  return { handleGlueWithNextLine };
};

export default implementGlueWithNextLine;
