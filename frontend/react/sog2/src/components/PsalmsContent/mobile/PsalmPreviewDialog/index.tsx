import React, { forwardRef, ReactElement, Ref, MouseEvent } from 'react';

import { Dialog, Zoom, Fade } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { usePsalmsContentMobileContext } from '../PsalmsContentMobileContextProvider';

import PsalmPreviewDialogBody from './PsalmPreviewDialogBody';
import { PsalmPreviewDialogWrapper } from './styled';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  const { previewChordsPsalmData } = usePsalmsContentMobileContext();
  return (
    <Fade ref={ref} {...props}>
      <div>
        <Zoom
          style={
            previewChordsPsalmData?.position
              ? {
                  transformOrigin: `${previewChordsPsalmData.position.x}px ${previewChordsPsalmData.position.y}px`,
                }
              : undefined
          }
          ref={ref}
          {...props}
        >
          {props.children}
        </Zoom>
      </div>
    </Fade>
  );
});

const PsalmPreviewDialog = () => {
  const { previewChordsPsalmData, setPreviewChordsPsalmData } = usePsalmsContentMobileContext();

  const openDialog = !!previewChordsPsalmData?.psalmData;

  const handleClose = (e: MouseEvent) => {
    setPreviewChordsPsalmData({
      psalmData: undefined,
      position: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  return (
    <Dialog
      keepMounted
      TransitionComponent={Transition}
      transitionDuration={openDialog ? 600 : 300}
      open={openDialog}
      onClose={handleClose}
    >
      <PsalmPreviewDialogWrapper onClick={handleClose}>
        {previewChordsPsalmData?.psalmData ? (
          <PsalmPreviewDialogBody
            psalmId={previewChordsPsalmData.psalmData.id}
            transposition={previewChordsPsalmData.psalmData.transposition}
          />
        ) : null}
      </PsalmPreviewDialogWrapper>
    </Dialog>
  );
};

export default PsalmPreviewDialog;
