import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { ChordWheelSelectorContentWrapper, ChordWheelSelectorWrapper, ChordWheelSelectorItemWrapper } from './styled';

interface ChordWheelSelectorProps {
  height: number;
  paddings?: number;
  values: string[];
  onChange?: (newValue: string) => void;
  initIdx?: number;
  thresholdPercentage?: number;
}

interface ScrollingContainer extends HTMLSpanElement {
  onscrollend: () => void;
  scrollTop: number;
}

const ChordWheelSelector = ({
  height,
  paddings = 0,
  values,
  onChange,
  initIdx = 0,
  thresholdPercentage = 10,
}: ChordWheelSelectorProps) => {
  const containerRef = useRef<ScrollingContainer>(null);
  const [lastDownWheel, setLastDownWheel] = useState<boolean>(false);

  const parentHeight = useMemo(() => height + paddings * 2, [height, paddings]);

  const realThresholdPercentage = useMemo(
    () => Math.max(Math.min(thresholdPercentage, 0), 50) / 100,
    [thresholdPercentage],
  );

  useLayoutEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = initIdx * height;
    }
  }, [height, initIdx]);

  useEffect(() => {
    if (containerRef?.current) {
      const anchor = containerRef.current;
      anchor.onscrollend = () => {
        const rawChoise = anchor.scrollTop / height;
        const currentChoice = lastDownWheel
          ? Math.ceil(rawChoise - realThresholdPercentage)
          : Math.floor(rawChoise + realThresholdPercentage);
        anchor.scrollTop = currentChoice * height;
        onChange?.(values[currentChoice]);
      };
    }
  }, [containerRef, height, lastDownWheel, onChange, realThresholdPercentage, values]);

  if (!values.length) {
    return null;
  }

  const fullHeight = height * values.length;

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    setLastDownWheel(e.deltaY > 0);
  };

  return (
    <ChordWheelSelectorWrapper onWheel={handleWheel} height={`${parentHeight}px`} ref={containerRef}>
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
