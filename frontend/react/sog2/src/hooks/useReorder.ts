import { useEffect, useState } from 'react';

import { useDebouncedCallback } from 'use-debounce';

interface useReorderProps<T> {
  backendData: T[];
  updateBackend: (items: T[]) => void;
}

const useReorder = <T>({ backendData, updateBackend }: useReorderProps<T>) => {
  const [items, setItems] = useState<T[] | null>(null);

  const debounced = useDebouncedCallback((items: T[]) => updateBackend(items), 1000);

  useEffect(() => {
    if (items !== null) {
      debounced(items);
    }
  }, [items, debounced]);

  useEffect(() => {
    if (backendData) {
      setItems(null);
    }
  }, [backendData]);

  const orderableData = items ?? backendData;

  return { orderableData, onReorder: setItems };
};

export default useReorder;
