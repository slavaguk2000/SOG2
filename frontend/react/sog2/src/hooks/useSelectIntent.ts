import { useEffect, useLayoutEffect, useState } from 'react';

interface useSelectIntentProps<T, U> {
  hardSelected?: T;
  setHardSelected: (newSelected: T, ...params: Array<U>) => void;
  timeout: number;
}

const useSelectIntent = <T, U>({ hardSelected, setHardSelected, timeout }: useSelectIntentProps<T, U>) => {
  const [intendedSelection, setIntendedSelection] = useState<{ value: T; params: Array<U> } | null>(null);

  useEffect(() => {
    if (hardSelected && hardSelected === intendedSelection?.value) {
      setIntendedSelection(null);
    }
  }, [hardSelected, intendedSelection]);

  useLayoutEffect(() => {
    if (intendedSelection) {
      const timer = setTimeout(() => {
        if (intendedSelection && intendedSelection?.value !== hardSelected) {
          setHardSelected(intendedSelection.value, ...intendedSelection.params);
        }
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [hardSelected, intendedSelection, setHardSelected, timeout]);

  const setSoftSelected = (newSelected: T, ...params: Array<U>) => setIntendedSelection({ value: newSelected, params });

  return {
    softSelected: intendedSelection?.value ?? hardSelected,
    setSoftSelected,
  };
};

export default useSelectIntent;
