import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface AdaptiveFontSizeProp {
  maxFontSize: number;
  deps: unknown[];
}

const useAdaptiveFontSize = ({ maxFontSize, deps }: AdaptiveFontSizeProp) => {
  const viewRef = useRef<null | HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    if (viewRef.current && viewRef.current.clientHeight < viewRef.current.scrollHeight && fontSize > 1) {
      setFontSize(fontSize - 1);
    }
    // eslint-disable-next-line
  }, [fontSize, ...deps]);

  useEffect(() => {
    setFontSize(maxFontSize);
    // eslint-disable-next-line
  }, [maxFontSize, ...deps]);

  return {
    viewRef,
    fontSize,
  };
};

export default useAdaptiveFontSize;
