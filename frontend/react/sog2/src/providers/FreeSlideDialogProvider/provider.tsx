import React, { PropsWithChildren, SetStateAction, useState } from 'react';

import FreeSlideDialog, { FreeSlideDialogContent } from 'src/components/FreeSlideDialog';

import { usePresentation } from '../presentationProvider';

import FreeSlideDialogContext from './context';

const FreeSlideDialogProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<FreeSlideDialogContent | undefined>(undefined);

  const { setText } = usePresentation();

  const handleSetContent = (newContent: SetStateAction<FreeSlideDialogContent | undefined>) => {
    setContent((prev) => {
      const newContentValue = typeof newContent === 'function' ? newContent(prev) : newContent;

      if (open) {
        setText(newContentValue?.text ?? '', newContentValue?.title ?? '');
      }

      return newContentValue;
    });
  };

  const handleClose = () => {
    setOpen(false);
    handleSetContent(undefined);
  };

  return (
    <FreeSlideDialogContext.Provider
      value={{
        setOpen,
      }}
    >
      {children}
      <FreeSlideDialog open={open} onClose={handleClose} setContent={handleSetContent} content={content} />
    </FreeSlideDialogContext.Provider>
  );
};

export default FreeSlideDialogProvider;
