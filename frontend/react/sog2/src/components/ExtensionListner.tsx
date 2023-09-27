import { useEffect } from 'react';

import { useFreeSlideDialog } from 'src/providers/FreeSlideDialogProvider';

const ExtensionListener = () => {
  const { openWithFreeSlide } = useFreeSlideDialog();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.text) {
        openWithFreeSlide(event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [openWithFreeSlide]);

  return null;
};

export default ExtensionListener;
