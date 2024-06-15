import { useEffect, useMemo, useState } from 'react';

import { Slide } from '../../utils/gql/types';
import { useSermonData } from '../dataProviders/sermanDataProvider';
import { useMainScreenSegmentationData } from '../MainScreenSegmentationDataProvider';
import { usePlayerContext } from '../playerProvider';

import { useAudioMapping } from './provider';

interface AudioMappingFollowerProps {
  sermonData: Array<Slide>;
}

interface TimeEntry {
  timePoint: number;
  slide: Slide;
  spaceOffset: number;
}

const AudioMappingFollower = ({ sermonData }: AudioMappingFollowerProps) => {
  const { follow } = useAudioMapping();
  const { played, isPlaying } = usePlayerContext();
  const { handleUpdateSlide } = useSermonData();
  const { screensCount, currentScreen, setCurrentScreen } = useMainScreenSegmentationData();
  const [lastSlideId, setLastSlideId] = useState<string | null>(null);
  const [lastSlideOffset, setLastSlideOffset] = useState<number | null>(null);

  const timeEntries = useMemo(
    () =>
      sermonData
        .reduce((acc: TimeEntry[], slide) => {
          slide.audioMappings?.forEach(({ timePoint, spaceOffset }) => {
            if (timePoint && spaceOffset !== null && spaceOffset !== undefined) {
              acc.push({
                timePoint,
                slide,
                spaceOffset,
              });
            }
          });

          return acc;
        }, [])
        .sort((a, b) => a.timePoint - b.timePoint),
    [sermonData],
  );

  useEffect(() => {
    if (follow && isPlaying && timeEntries.length) {
      let currentTimeEntry = timeEntries[0];
      for (let i = 0; i < timeEntries.length; i++) {
        if (timeEntries[i].timePoint > played) {
          break;
        } else {
          currentTimeEntry = timeEntries[i];
        }
      }

      if (currentTimeEntry.slide.id && currentTimeEntry.slide.id !== lastSlideId) {
        setLastSlideId(currentTimeEntry.slide.id);
        handleUpdateSlide(currentTimeEntry.slide);
      }

      if (
        currentTimeEntry.spaceOffset !== null &&
        currentTimeEntry.spaceOffset !== undefined &&
        currentTimeEntry.spaceOffset !== lastSlideOffset
      ) {
        setLastSlideOffset(currentTimeEntry.spaceOffset);

        if (screensCount > 1) {
          const newScreen = Math.round(screensCount * currentTimeEntry.spaceOffset);

          if (newScreen !== currentScreen) {
            setCurrentScreen(newScreen);
          }
        }
      }
    }
  }, [
    currentScreen,
    follow,
    handleUpdateSlide,
    isPlaying,
    lastSlideId,
    lastSlideOffset,
    played,
    screensCount,
    setCurrentScreen,
    timeEntries,
  ]);

  return null;
};

export default AudioMappingFollower;
