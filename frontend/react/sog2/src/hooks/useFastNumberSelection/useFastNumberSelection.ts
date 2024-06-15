import React, { useEffect, useState } from 'react';

const useFastNumberSelection = (
  changeSlideByNumber: (currentNumber: number) => void,
  maxLength: number,
  {
    debounceSeconds = 1,
  }: {
    debounceSeconds?: number;
  } = {},
): {
  preselectNumber: number;
  handleKeyDown: (event: React.KeyboardEvent) => void;
} => {
  const [preselectNumber, setPreselectNumber] = useState<number>(0);

  useEffect(() => {
    const selectPreselectNumberVerseCallback = setTimeout(() => {
      if (preselectNumber) {
        changeSlideByNumber(preselectNumber);

        setPreselectNumber(0);
      }
    }, 1000 * debounceSeconds);

    return () => clearTimeout(selectPreselectNumberVerseCallback);
  }, [changeSlideByNumber, debounceSeconds, preselectNumber, setPreselectNumber]);

  const handleNumberPressed = (pressedNumber: number): boolean => {
    if (!maxLength || pressedNumber > maxLength) {
      return false;
    }

    setPreselectNumber((prev) => {
      const maybeNewPreselect = prev * 10 + pressedNumber;

      if (maybeNewPreselect * 10 > maxLength) {
        changeSlideByNumber(maybeNewPreselect > maxLength ? prev : maybeNewPreselect);

        return 0;
      }

      return maybeNewPreselect;
    });

    return true;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.length === 1 && /[0-9]/.test(event.key)) {
      if (handleNumberPressed(Number(event.key))) {
        event.stopPropagation();
      }
    }
  };

  return {
    preselectNumber,
    handleKeyDown,
  };
};

export default useFastNumberSelection;
