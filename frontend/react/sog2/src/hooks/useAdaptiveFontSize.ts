import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface AdaptiveFontSizeProp {
  maxFontSize: number;
  deps: unknown[];
}

const useAdaptiveFontSize = ({ maxFontSize, deps }: AdaptiveFontSizeProp) => {
  const viewRef = useRef<null | HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(maxFontSize);

  useLayoutEffect(() => {
    if (viewRef.current && viewRef.current.clientHeight < viewRef.current.scrollHeight) {
      setFontSize(fontSize - 1);
    }
  }, [fontSize, ...deps]);

  useEffect(() => {
    setFontSize(maxFontSize);
  }, [maxFontSize, ...deps]);

  return {
    viewRef,
    fontSize,
  };
};

export default useAdaptiveFontSize;
