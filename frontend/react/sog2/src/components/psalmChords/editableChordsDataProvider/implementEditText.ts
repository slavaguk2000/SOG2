import { PsalmData } from '../../../utils/gql/types';

interface ImplementEditTextProps {
  setNewChordsData: (newChordsData: PsalmData) => void;
  chordsData: PsalmData;
}

const implementEditText = ({ setNewChordsData, chordsData }: ImplementEditTextProps) => {
  const handleEditText = (coupletContentId: string, newText: string) => {
    setNewChordsData({
      id: chordsData.id,
      psalm: chordsData.psalm,
      couplets: chordsData.couplets.map((couplet) => ({
        ...couplet,
        coupletContent: couplet.coupletContent.map((coupletContentItem) => {
          if (coupletContentItem.id === coupletContentId) {
            return {
              ...coupletContentItem,
              text: newText || ' ',
            };
          }

          return coupletContentItem;
        }),
      })),
    });
  };

  return { handleEditText };
};

export default implementEditText;
