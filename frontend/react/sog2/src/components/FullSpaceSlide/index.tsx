import React, { DependencyList, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Typography } from '@mui/material';
import ResizeObserver from 'resize-observer-polyfill';
import { useDebouncedCallback } from 'use-debounce';

import { FullSpaceSlideWrapper, ContentWrapper, TitleWrapper } from './styles';

interface FullSpaceSlideProps {
  content: string;
  title: string;
  maxContentFontSize: number;
  minTitleFontSize: number;
  maxTitleFontSize: number;
  additionalRecalculateDeps?: DependencyList;
}

enum FontSelectionState {
  FAST_DECREASE = 0,
  SLOW_INCREASE = 1,
  SLOW_DECREASE = 2,
}

interface FontSizeState {
  size: number;
  state: FontSelectionState;
}

const FullSpaceSlide = ({
  content,
  title,
  minTitleFontSize,
  maxTitleFontSize,
  maxContentFontSize,
  additionalRecalculateDeps = [],
}: FullSpaceSlideProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastSize, setLastSize] = useState<{ width: number; height: number } | null>(null);
  const defaultValue = useMemo(
    () => ({
      state: FontSelectionState.FAST_DECREASE,
      size: maxContentFontSize,
    }),
    [maxContentFontSize],
  );

  const [fontSizeState, setFontSizeState] = useState<FontSizeState>(defaultValue);

  const recalculate = useCallback(() => setFontSizeState(defaultValue), [setFontSizeState, defaultValue]);

  const debouncedRecalculate = useDebouncedCallback(() => {
    recalculate();
  }, 1000);

  useEffect(() => {
    recalculate();
  }, [content, title, recalculate, ...additionalRecalculateDeps]);

  useEffect(() => {
    if (contentRef.current && content) {
      const { clientHeight, scrollHeight } = contentRef.current;
      if (fontSizeState.state === FontSelectionState.FAST_DECREASE) {
        setFontSizeState(
          clientHeight < scrollHeight
            ? {
                size: fontSizeState.size * 0.9,
                state: FontSelectionState.FAST_DECREASE,
              }
            : {
                size: fontSizeState.size,
                state: FontSelectionState.SLOW_INCREASE,
              },
        );
      } else if (fontSizeState.state === FontSelectionState.SLOW_INCREASE) {
        setFontSizeState(
          clientHeight < scrollHeight
            ? {
                size: fontSizeState.size,
                state: FontSelectionState.SLOW_DECREASE,
              }
            : {
                size: fontSizeState.size / 0.99,
                state: FontSelectionState.SLOW_INCREASE,
              },
        );
      } else {
        if (clientHeight < scrollHeight) {
          setFontSizeState({
            size: fontSizeState.size * 0.99,
            state: FontSelectionState.SLOW_DECREASE,
          });
        }
      }
    }
  }, [fontSizeState, setFontSizeState, recalculate, content]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { clientWidth, clientHeight } = entry.target;
        if (lastSize) {
          if (lastSize.width === clientWidth && lastSize.height === clientHeight) {
            continue;
          }

          debouncedRecalculate();
        }

        setLastSize({ width: clientWidth, height: clientHeight });
      }
    });

    const element = containerRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [debouncedRecalculate, lastSize]);

  return (
    <FullSpaceSlideWrapper ref={containerRef}>
      <ContentWrapper ref={contentRef}>
        <Typography
          color={fontSizeState.state === FontSelectionState.SLOW_DECREASE ? 'black' : 'white'}
          lineHeight={0.95}
          letterSpacing="-0.02em"
          fontSize={`${fontSizeState.size}vw`}
          align="center"
        >
          {content}
        </Typography>
      </ContentWrapper>
      <TitleWrapper>
        <Typography
          color="black"
          lineHeight={1}
          fontSize={`${Math.max(Math.min(fontSizeState.size, maxTitleFontSize), minTitleFontSize)}vw`}
          align="center"
        >
          {title}
        </Typography>
      </TitleWrapper>
    </FullSpaceSlideWrapper>
  );
};

export default FullSpaceSlide;
