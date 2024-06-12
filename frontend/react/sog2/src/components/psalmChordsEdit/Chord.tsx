import React from 'react';

import { getChordText } from '../../utils/chordUtils';
import { CoupletContentChord } from '../../utils/gql/types';

import { ChordWrapper } from './styled';

interface ChordProps {
  chordData: CoupletContentChord;
  mainKey: number;
  nonDeletable?: boolean;
  isChordDeleting?: boolean;
  isChordEditing?: boolean;
  isSourceChordChoosing?: boolean;
  isDestinationChordChoosing?: boolean;
  isSameChordLinking?: boolean;
  isCurrentChordLinking?: boolean;
  contentFontSize: number;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  onLinkedChordMenu: (anchor: HTMLElement) => void;
}

const Chord = ({
  chordData,
  mainKey,
  nonDeletable,
  onClick,
  isChordDeleting,
  isChordEditing,
  isSourceChordChoosing,
  isDestinationChordChoosing,
  isSameChordLinking,
  isCurrentChordLinking,
  contentFontSize,
  onLinkedChordMenu,
}: ChordProps) => {
  const handleContextMenu = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (isSameChordLinking) {
      onLinkedChordMenu(event.currentTarget);
      event.preventDefault();
    }
  };

  return (
    <ChordWrapper
      nonDeletable={nonDeletable}
      isChordDeleting={isChordDeleting}
      contentFontSize={contentFontSize}
      isChordEditing={isChordEditing}
      isSourceChordChoosing={isSourceChordChoosing}
      isDestinationChordChoosing={isDestinationChordChoosing}
      isSameChordLinking={isSameChordLinking}
      isCurrentChordLinking={isCurrentChordLinking}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {getChordText(chordData, mainKey)}
    </ChordWrapper>
  );
};

export default Chord;
