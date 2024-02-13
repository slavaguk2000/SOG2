import React, { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import { arrayToMap } from '../../utils';
import { sermon, sermons } from '../../utils/gql/queries';
import { Query, QuerySermonArgs, QuerySermonsArgs, Slide } from '../../utils/gql/types';
import { useInstrumentsField } from '../instrumentsFieldProvider';
import { usePlayerContext } from '../playerProvider';

import ChangePlayingSrcProposalDialog from './ChangePlayingSrcProposalDialog';
import SermonDataProviderContext from './context';

interface SermonDataProviderProps extends PropsWithChildren {
  sermonsCollectionId?: string;
}

const SermonDataProvider: FC<SermonDataProviderProps> = ({ sermonsCollectionId = '0', children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSermonId = searchParams.get('id') ?? undefined;

  const handleSermonSelect = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        prev.set('id', id);

        return prev;
      });
    },
    [setSearchParams],
  );

  const { data: sermonsData } = useQuery<Pick<Query, 'sermons'>, QuerySermonsArgs>(sermons, {
    variables: {
      sermonsCollectionId,
    },
    fetchPolicy: 'cache-first',
  });

  const { data: currentSermonData } = useQuery<Pick<Query, 'sermon'>, QuerySermonArgs>(sermon, {
    variables: {
      sermonId: currentSermonId ?? '',
    },
    fetchPolicy: 'cache-first',
    skip: !currentSermonId,
  });

  useEffect(() => {
    if (!currentSermonId && sermonsData) {
      handleSermonSelect(sermonsData.sermons[0].id);
    }
  }, [currentSermonId, handleSermonSelect, sermonsData]);

  const { handleUpdateSlide: instrumentsHandleUpdateSlide, currentSlide } = useInstrumentsField();

  const sermonsMap = useMemo(() => sermonsData && arrayToMap(sermonsData.sermons), [sermonsData]);
  const sermonParagraphsMap = useMemo(
    () => currentSermonData && arrayToMap(currentSermonData.sermon, { mapper: (slide, idx) => ({ ...slide, idx }) }),
    [currentSermonData],
  );

  const currentSermon = currentSermonId ? sermonsMap?.[currentSermonId] : undefined;

  const { setAudio, src, played, isPlaying } = usePlayerContext();

  const audioMapping = currentSermon?.audioMapping;

  const audioLink = audioMapping?.audioLink;

  const handleUpdateSlide = (newSlide?: Slide) => {
    const sermonId = newSlide?.location?.[1];

    if (sermonId) {
      setSearchParams((prev) => ({ ...prev, id: sermonId }));
    }

    const slideAudioMapping =
      audioMapping && isPlaying && src === audioMapping.audioLink
        ? {
            slideCollectionAudioMappingId: audioMapping.id,
            timePoint: Math.floor(played),
          }
        : null;

    instrumentsHandleUpdateSlide(
      newSlide && {
        slide: newSlide,
        presentationData: {
          text: `${newSlide.location?.[2] ? `${newSlide.location?.[2]}. ` : ''}${newSlide.content}`,
          title: (sermonId && sermonsMap?.[sermonId].name) || '',
        },
        slideAudioMapping,
      },
    );
  };

  const handleNextSlide = () => {
    if (!(currentSermonData && sermonParagraphsMap && currentSlide?.id)) {
      return;
    }

    const currentIdx = sermonParagraphsMap[currentSlide.id].idx;

    const nextIdx = currentIdx + 1;

    if (currentIdx >= 0 && currentSermonData.sermon.length > nextIdx) {
      handleUpdateSlide(currentSermonData.sermon[nextIdx]);
    }
  };

  const handlePrevSlide = () => {
    if (!(currentSermonData && sermonParagraphsMap && currentSlide?.id)) {
      return;
    }

    const currentIdx = sermonParagraphsMap[currentSlide.id].idx;

    const prevIdx = currentIdx - 1;

    if (prevIdx >= 0) {
      handleUpdateSlide(currentSermonData.sermon[prevIdx]);
    }
  };

  const handleUpdateLocation = (newSlide: Slide) => {
    console.log('handleUpdateLocation', newSlide);
  };

  // work with player
  const [playAnother, setPlayAnother] = useState(false);

  useEffect(() => {
    setPlayAnother(false);
  }, [currentSermonId]);

  const [changePlayingSrcProposalDialogData, setChangePlayingSrcProposalDialogData] = useState({
    sermonName: '',
    audioLink: '',
  });

  const handleCloseDialog = () =>
    setChangePlayingSrcProposalDialogData({
      sermonName: '',
      audioLink: '',
    });

  const handleChangeAudio = () => {
    setAudio(changePlayingSrcProposalDialogData.audioLink, changePlayingSrcProposalDialogData.sermonName);
    handleCloseDialog();
  };

  const handleDontChangeAudio = () => {
    setPlayAnother(true);
    handleCloseDialog();
  };

  const sermonName = currentSermon?.name;

  useEffect(() => {
    if (audioLink && sermonName && audioLink !== src && !playAnother) {
      if (isPlaying) {
        setChangePlayingSrcProposalDialogData({
          sermonName,
          audioLink,
        });
      } else {
        setAudio(audioLink, sermonName);
      }
    }
  }, [audioLink, isPlaying, playAnother, played, sermonName, setAudio, src]);

  //

  return (
    <SermonDataProviderContext.Provider
      value={{
        handleNextSlide,
        handlePrevSlide,
        handleUpdateSlide,
        handleUpdateLocation,
        handleSermonSelect,
        currentSermon,
        sermonsData: sermonsData?.sermons,
        currentSermonSlides: currentSermonData?.sermon,
      }}
    >
      {children}
      <ChangePlayingSrcProposalDialog
        open={!!(changePlayingSrcProposalDialogData.sermonName && changePlayingSrcProposalDialogData.audioLink)}
        sermonTitle={changePlayingSrcProposalDialogData.sermonName}
        handleNo={handleDontChangeAudio}
        handleYes={handleChangeAudio}
      />
    </SermonDataProviderContext.Provider>
  );
};

export default SermonDataProvider;
