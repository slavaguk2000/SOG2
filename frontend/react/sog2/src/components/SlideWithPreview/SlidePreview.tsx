import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useMultiScreenDataProvider } from '../../providers/multiScreenDataProvider';

import { SlidePreviewContainer, SlidePreviewWrapper, SlidePreviewText, SlidePreviewViewBox } from './styled';

interface SlidePreviewProps {
  content: string;
}

const minFontSize = 6;
const fontStep = 1;
const backFontStep = 0.1;
const maxFontSize = 20;
const overflow = 10;
const previewWidthInPixels = 100;

const SlidePreview = ({ content }: SlidePreviewProps) => {
  const { currentScreen, screensCount, setScreensCount, ratio } = useMultiScreenDataProvider();
  const [fontSize, setFontSize] = useState(minFontSize);
  const [overflowFontSize, setOverflowFontSize] = useState<null | number>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);

  const previewHeightInPixels = useMemo(() => previewWidthInPixels / ratio, [ratio]);

  useEffect(() => {
    if (containerRef?.current) {
      const screenHeight = containerRef.current?.clientHeight;
      const currentScreenCount = Math.ceil((screenHeight - overflow) / (previewHeightInPixels - overflow));
      if (!screensCount) {
        setScreensCount(currentScreenCount);
      } else if (overflowFontSize) {
        if (currentScreenCount > screensCount) {
          setFontSize(fontSize - backFontStep);
        }
      } else if (currentScreenCount > screensCount) {
        setOverflowFontSize(fontSize);
      } else {
        if (!overflowFontSize && fontSize < maxFontSize) {
          setFontSize(fontSize + fontStep);
        }
      }
    }
  }, [screensCount, overflowFontSize, fontSize, setScreensCount, previewHeightInPixels]);

  const clientHeight = containerRef?.current?.clientHeight;

  const realOverflow = useMemo(() => {
    if (clientHeight && screensCount) {
      return (screensCount * previewHeightInPixels - clientHeight) / (screensCount - 1);
    }

    return overflow;
  }, [clientHeight, previewHeightInPixels, screensCount]);

  const previewTop = screensCount ? currentScreen * (previewHeightInPixels - realOverflow) : undefined;
  const previewBottom = screensCount ? undefined : 0;

  return (
    <SlidePreviewWrapper width={`${previewWidthInPixels}px`} visible={!!(screensCount && screensCount > 1)}>
      <SlidePreviewContainer ref={containerRef}>
        <SlidePreviewText fontSize={`${fontSize}px`}>{content}</SlidePreviewText>
      </SlidePreviewContainer>
      <SlidePreviewViewBox
        rendered={!!screensCount}
        top={previewTop}
        bottom={previewBottom}
        width={`${previewWidthInPixels}px`}
        height={`${previewHeightInPixels}px`}
      />
    </SlidePreviewWrapper>
  );
};

export default SlidePreview;
