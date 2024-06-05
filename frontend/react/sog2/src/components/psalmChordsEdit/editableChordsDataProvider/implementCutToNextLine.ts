import { v4 as uuidv4 } from 'uuid';

import { CoupletContent, PsalmData } from '../../../utils/gql/types';

interface ImplementCutToNextLineProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementCutToNextLine = ({ setNewChordsData, chordsData }: ImplementCutToNextLineProps) => {
  const handleCutToNextLine = (coupletId: string, coupletContentId: string, charPosition: number) => {
    setNewChordsData({
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => {
        if (couplet.id === coupletId) {
          let addLine = false;
          return {
            ...couplet,
            coupletContent: couplet.coupletContent.reduce((acc: CoupletContent[], coupletContentItem) => {
              if (addLine) {
                acc.push({ ...coupletContentItem, line: coupletContentItem.line + 1 });
              } else if (coupletContentItem.id === coupletContentId) {
                acc.push({ ...coupletContentItem, text: coupletContentItem.text.slice(0, charPosition) });
                acc.push({
                  ...coupletContentItem,
                  text: coupletContentItem.text.slice(charPosition),
                  line: coupletContentItem.line + 1,
                  id: uuidv4(),
                });
                addLine = true;
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

  return { handleCutToNextLine };
};

export default implementCutToNextLine;
