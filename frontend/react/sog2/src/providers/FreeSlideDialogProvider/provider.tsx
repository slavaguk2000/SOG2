import React, { PropsWithChildren, SetStateAction, useState } from 'react';

import { useMutation } from '@apollo/client';

import ExtensionListener from 'src/components/ExtensionListner';
import FreeSlideDialog, { FreeSlideDialogContent } from 'src/components/FreeSlideDialog';
import { setFreeSlide } from 'src/utils/gql/queries';
import { Mutation, MutationSetFreeSlideArgs } from 'src/utils/gql/types';

import { usePresentation } from '../presentationProvider';

import FreeSlideDialogContext from './context';

const FreeSlideDialogProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<FreeSlideDialogContent | undefined>(undefined);

  const [setFreeSlideMutation] = useMutation<Pick<Mutation, 'setFreeSlide'>, MutationSetFreeSlideArgs>(setFreeSlide);

  const { setText } = usePresentation();

  const handleSetContent = (newContent: SetStateAction<FreeSlideDialogContent | undefined>, forceOpen = false) => {
    setContent((prev) => {
      const newContentValue = typeof newContent === 'function' ? newContent(prev) : newContent;

      if (open || forceOpen) {
        const text = newContentValue?.text ?? '';
        const title = newContentValue?.title ?? '';
        setText(text, title);
        setFreeSlideMutation({
          variables: {
            text,
            title,
          },
        }).catch((e) => console.error(e));
      }

      return newContentValue;
    });
  };

  const handleClose = () => {
    setOpen(false);
    handleSetContent(undefined);
  };

  const openWithFreeSlide = (content: FreeSlideDialogContent) => {
    setOpen(true);
    handleSetContent(content, true);
  };

  return (
    <FreeSlideDialogContext.Provider
      value={{
        setOpen,
        openWithFreeSlide,
      }}
    >
      <ExtensionListener />
      {children}
      <FreeSlideDialog open={open} onClose={handleClose} setContent={handleSetContent} content={content} />
    </FreeSlideDialogContext.Provider>
  );
};

export default FreeSlideDialogProvider;
