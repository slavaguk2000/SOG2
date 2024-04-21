import React, { useEffect, useRef, useState } from 'react';

import { SlidePreviewContainer, SlidePreviewWrapper, SlidePreviewText, SlidePreviewViewBox } from './styled';

interface SlidePreviewProps {
  content: string;
}

const minFontSize = 6;
const fontStep = 1;
const backFontStep = 0.1;
const maxFontSize = 20;
const ratio = 4 / 3;
const overflow = 10;
const previewWidthInPixels = 100;
const previewHeightInPixels = previewWidthInPixels / ratio;

const SlidePreview = ({ content }: SlidePreviewProps) => {
  const [viewPortOffset, setViewPortOffset] = useState(0);
  const [fontSize, setFontSize] = useState(minFontSize);
  const [overflowFontSize, setOverflowFontSize] = useState<null | number>(null);
  const [screenCount, setScreenCount] = useState<null | number>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef?.current) {
      const screenHeight = containerRef.current?.clientHeight;
      const currentScreenCount = Math.ceil((screenHeight - overflow) / (previewHeightInPixels - overflow));
      if (!screenCount) {
        setScreenCount(currentScreenCount);
      } else if (overflowFontSize) {
        if (currentScreenCount > screenCount) {
          setFontSize(fontSize - backFontStep);
        }
      } else if (currentScreenCount > screenCount) {
        setOverflowFontSize(fontSize);
      } else {
        if (!overflowFontSize && fontSize < maxFontSize) {
          setFontSize(fontSize + fontStep);
        }
      }
    }
  }, [screenCount, overflowFontSize, fontSize]);

  useEffect(() => {
    setTimeout(() => setViewPortOffset((prev) => (screenCount ? (prev + 1) % screenCount : 0)), 2000);
  }, [screenCount, viewPortOffset]);

  return (
    <SlidePreviewWrapper width={`${previewWidthInPixels}px`}>
      <SlidePreviewContainer ref={containerRef}>
        <SlidePreviewText fontSize={`${fontSize}px`}>{content}</SlidePreviewText>
      </SlidePreviewContainer>
      <SlidePreviewViewBox
        top={viewPortOffset * (previewHeightInPixels - overflow)}
        width={`${previewWidthInPixels}px`}
        height={`${previewHeightInPixels}px`}
      />
    </SlidePreviewWrapper>
  );
};

export default SlidePreview;
