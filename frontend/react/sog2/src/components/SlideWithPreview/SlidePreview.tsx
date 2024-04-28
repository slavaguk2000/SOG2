import React, { useRef } from 'react';

import { multiScreenShowPreviewScale } from '../../constants/behaviorConstants';
import { useMainScreenSegmentationData } from '../../providers/MainScreenSegmentationDataProvider';

import { SlidePreviewContainer, SlidePreviewWrapper, SlidePreviewText, SlidePreviewViewBox } from './styled';

interface SlidePreviewProps {
  content: string;
}

const SlidePreview = ({ content }: SlidePreviewProps) => {
  const { mainScreenSize, currentScreen, previewScreensData } = useMainScreenSegmentationData();
  const containerRef = useRef<null | HTMLDivElement>(null);

  const scaledMainScreenWidth = mainScreenSize ? mainScreenSize.width * multiScreenShowPreviewScale : 10;
  const scaledFontSize = previewScreensData ? (previewScreensData.fontSize * scaledMainScreenWidth) / 100 : 10;

  const scaledViewBoxWidth = previewScreensData ? previewScreensData.viewWidth * multiScreenShowPreviewScale : 10;
  const scaledViewBoxHeight = mainScreenSize ? mainScreenSize.height * multiScreenShowPreviewScale : 10;
  const scaledOffset =
    previewScreensData && mainScreenSize
      ? currentScreen * (mainScreenSize.height - previewScreensData.overlay) * multiScreenShowPreviewScale
      : 0;

  return (
    <SlidePreviewWrapper width={`${scaledMainScreenWidth}px`}>
      <SlidePreviewContainer ref={containerRef}>
        <SlidePreviewText width={`${scaledViewBoxWidth}px`} fontSize={`${scaledFontSize}px`}>
          {content}
        </SlidePreviewText>
      </SlidePreviewContainer>
      <SlidePreviewViewBox
        top={scaledOffset}
        width={`${scaledMainScreenWidth}px`}
        height={`${scaledViewBoxHeight}px`}
        smoothScrolling
      />
    </SlidePreviewWrapper>
  );
};

export default SlidePreview;
