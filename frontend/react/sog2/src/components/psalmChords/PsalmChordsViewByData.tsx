import React, { useEffect, useState } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { Maybe, PsalmData } from '../../utils/gql/types';
import { STATIC_IMAGES_URL } from '../../utils/hostUtils';

import EditableChordsDataProvider from './editableChordsDataProvider';
import PsalmChordsView from './PsalmChordsView';

interface PsalmChordsViewByDataProps {
  imagesPreferred: boolean;
  psalmId?: string;
  psalmData?: Maybe<PsalmData>;
  rootTransposition?: Maybe<number>;
  fullScreenSize?: boolean;
}

const PsalmChordsViewByData = ({
  imagesPreferred,
  psalmData,
  psalmId,
  rootTransposition,
  fullScreenSize,
}: PsalmChordsViewByDataProps) => {
  const [loadedImageUrl, setLoadedImageUrl] = useState<{ id: string; url: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const loadedImageUrlId = loadedImageUrl?.id;

  useEffect(() => {
    if (imagesPreferred && psalmId && psalmId !== loadedImageUrlId) {
      setLoadedImageUrl(null);
      setLoading(true);
      fetch(`${STATIC_IMAGES_URL}${psalmId}.jpg`)
        .then((response) => response.blob())
        .then((blob) => {
          if (blob.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(blob);
            setLoadedImageUrl({ id: psalmId, url: imageUrl });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [imagesPreferred, loadedImageUrlId, psalmId]);

  return loading ? (
    <CircularProgress />
  ) : imagesPreferred && loadedImageUrl ? (
    <Box width={fullScreenSize ? '100vw' : '100%'} height={fullScreenSize ? '100vh' : '100%'}>
      <img
        style={{ objectFit: 'contain' }}
        width="100%"
        height="100%"
        src={loadedImageUrl.url}
        alt={loadedImageUrl.id}
      />
    </Box>
  ) : psalmData ? (
    <EditableChordsDataProvider
      forceData={psalmData}
      initialData={psalmData}
      rootTransposition={rootTransposition ?? undefined}
    >
      <PsalmChordsView />
    </EditableChordsDataProvider>
  ) : null;
};

export default PsalmChordsViewByData;
