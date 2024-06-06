import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { ChordWheelSelectorContentWrapper, ChordWheelSelectorWrapper, ChordWheelSelectorItemWrapper } from './styled';

interface ChordWheelSelectorProps {
  height: number;
  paddings?: number;
  values: string[];
  onChange?: (newValue: string) => void;
  initIdx?: number;
}

interface ScrollingContainer extends HTMLSpanElement {
  onscrollend: () => void;
  scrollTop: number;
}

const ChordWheelSelector = ({ height, paddings = 0, values, onChange, initIdx = 0 }: ChordWheelSelectorProps) => {
  const containerRef = useRef<ScrollingContainer>(null);

  const parentHeight = useMemo(() => height + paddings * 2, [height, paddings]);

  useLayoutEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = initIdx * height;
    }
  }, []);

  useEffect(() => {
    if (containerRef?.current) {
      const anchor = containerRef.current;
      anchor.onscrollend = () => {
        const initialScrollTop = anchor.scrollTop;
        const currentChoice = Math.round(initialScrollTop / height);
        anchor.scrollTop = currentChoice * height;
        onChange?.(values[currentChoice]);
      };
    }
  }, [containerRef, height, onChange, values]);

  if (!values.length) {
    return null;
  }

  const fullHeight = height * values.length;

  return (
    <ChordWheelSelectorWrapper height={`${parentHeight}px`} ref={containerRef}>
      <ChordWheelSelectorContentWrapper padding={`${paddings}px 0`} height={`${fullHeight}px`}>
        {values.map((key) => (
          <ChordWheelSelectorItemWrapper height={`${height}px`} key={key}>
            {key}
          </ChordWheelSelectorItemWrapper>
        ))}
      </ChordWheelSelectorContentWrapper>
    </ChordWheelSelectorWrapper>
  );
};

export default ChordWheelSelector;
