import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import usePreviousVersions from '../../../hooks/usePreviousVersions';
import { CoupletContent, PsalmData } from '../../../utils/gql/types';

type ChordsDataContextType = {
  chordsData: PsalmData;
  handleCutToNextLine: (coupletId: string, coupletContentId: string, charPosition: number) => void;
};

const defaultValue: ChordsDataContextType = {
  chordsData: {
    couplets: [],
    psalm: {
      id: 'unknown',
      name: 'unknown',
    },
  },
  handleCutToNextLine: () => true,
};

export const ChordsDataContextTypeContext = createContext<ChordsDataContextType>(defaultValue);

ChordsDataContextTypeContext.displayName = 'ChordsDataContextTypeContext';

export const useEditableChordsData = () => {
  return useContext(ChordsDataContextTypeContext);
};

interface EditableChordsDataProviderProps extends PropsWithChildren {
  initialData: PsalmData;
}

const EditableChordsDataProvider = ({ children, initialData }: EditableChordsDataProviderProps) => {
  const [chordsData, setChordsData] = useState<PsalmData>(initialData);

  const {} = usePreviousVersions(initialData);

  const handleCutToNextLine = (coupletId: string, coupletContentId: string, charPosition: number) => {
    setChordsData({
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

  return (
    <ChordsDataContextTypeContext.Provider
      value={{
        chordsData,
        handleCutToNextLine,
      }}
    >
      {children}
    </ChordsDataContextTypeContext.Provider>
  );
};

export default EditableChordsDataProvider;
