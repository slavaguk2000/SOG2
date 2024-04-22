import React, { useRef } from 'react';

import { Popper } from '@mui/material';

import BibleEntityItem, { BibleEntityItemProps } from '../BibleContent/BibleEntityItem';

import SlidePreview from './SlidePreview';
import { SlideWithPreviewWrapper } from './styled';

interface SlideWithPreviewProps {
  bibleEntityItemProps: BibleEntityItemProps;
}

const SlideWithPreview = ({ bibleEntityItemProps }: SlideWithPreviewProps) => {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const anchorEl = wrapperRef?.current;
  const popperOpen = bibleEntityItemProps.selected;

  return (
    <SlideWithPreviewWrapper ref={wrapperRef}>
      <BibleEntityItem {...bibleEntityItemProps} />
      {popperOpen && (
        <Popper
          sx={{
            pointerEvents: 'none',
          }}
          open={!!(popperOpen && anchorEl)}
          anchorEl={anchorEl}
          placement="bottom"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [200, 0],
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top', 'bottom'],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                altBoundary: true,
                boundary: 'clippingParents',
                rootBoundary: 'viewport',
                tether: true,
                altAxis: true,
              },
            },
            {
              name: 'computeStyles',
              options: {
                gpuAcceleration: false,
                adaptive: true,
                position: 'fixed',
              },
            },
          ]}
        >
          <SlidePreview content={bibleEntityItemProps.name} />
        </Popper>
      )}
    </SlideWithPreviewWrapper>
  );
};

export default SlideWithPreview;
