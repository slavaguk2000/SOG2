import React, { useEffect, useState } from 'react';

import { useSubscription } from '@apollo/client';
import { Box } from '@mui/material';

import EditableChordsDataProvider from '../components/psalmChords/editableChordsDataProvider';
import PsalmChordsView from '../components/psalmChords/PsalmChordsView';
import { activePsalmChordsSubscription } from '../utils/gql/queries';
import { Subscription } from '../utils/gql/types';
import { STATIC_IMAGES_URL } from '../utils/hostUtils';

const ActivePsalmChordsPage = () => {
  const imagesPreferred = true;
  const [loadedImageUrl, setLoadedImageUrl] = useState<{ id: string; url: string } | null>(null);
  const { data } = useSubscription<Pick<Subscription, 'activePsalmChordsSubscription'>>(activePsalmChordsSubscription);

  const psalmId = data?.activePsalmChordsSubscription?.psalmData?.psalm.id;
  const loadedImageUrlId = loadedImageUrl?.id;

  useEffect(() => {
    if (imagesPreferred && psalmId && psalmId !== loadedImageUrlId) {
      setLoadedImageUrl(null);
      fetch(`${STATIC_IMAGES_URL}${psalmId}.jpg`)
        .then((response) => response.blob())
        .then((blob) => {
          if (blob.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(blob);
            setLoadedImageUrl({ id: psalmId, url: imageUrl });
          }
        });
    }
  }, [imagesPreferred, loadedImageUrlId, psalmId]);

  return imagesPreferred && loadedImageUrl ? (
    <Box width="100vw" height="100vh">
      <img
        style={{ objectFit: 'contain' }}
        width="100%"
        height="100%"
        src={loadedImageUrl.url}
        alt={loadedImageUrl.id}
      />
    </Box>
  ) : (
    data?.activePsalmChordsSubscription?.psalmData && (
      <EditableChordsDataProvider
        forceData={data.activePsalmChordsSubscription.psalmData}
        initialData={data.activePsalmChordsSubscription.psalmData}
        rootTransposition={data.activePsalmChordsSubscription?.rootTransposition ?? undefined}
      >
        <PsalmChordsView />
      </EditableChordsDataProvider>
    )
  );
};

export default ActivePsalmChordsPage;
