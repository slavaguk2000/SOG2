import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

interface PreviewChordsPsalmData {
  id?: string;
  position?: {
    x: number;
    y: number;
  };
}

const PsalmsContentMobileContext = createContext<{
  previewChordsPsalmData?: PreviewChordsPsalmData;
  setPreviewChordsPsalmData: Dispatch<SetStateAction<PreviewChordsPsalmData | undefined>>;
}>({
  setPreviewChordsPsalmData: () => true,
});

export const usePsalmsContentMobileContext = () => useContext(PsalmsContentMobileContext);

const PsalmsContentMobileContextProvider = ({ children }: PropsWithChildren) => {
  const [previewChordsPsalmData, setPreviewChordsPsalmData] = useState<undefined | PreviewChordsPsalmData>();

  return (
    <PsalmsContentMobileContext.Provider value={{ previewChordsPsalmData, setPreviewChordsPsalmData }}>
      {children}
    </PsalmsContentMobileContext.Provider>
  );
};

export default PsalmsContentMobileContextProvider;
