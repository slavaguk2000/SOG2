import React from 'react';

import { getChordText } from '../../utils/chordUtils';
import { CoupletContentChord } from '../../utils/gql/types';

import { useChordsEditInstrumentsContext } from './instrumentsProvider';
import { ChordWrapper } from './styled';

interface ChordProps {
  chordData: CoupletContentChord;
  mainKey: number;
  nonDeletable?: boolean;
  isLinkSourceChordChoosing?: boolean;
  isCopySourceChordChoosing?: boolean;
  isLinkDestinationChordChoosing?: boolean;
  isSameChordLinking?: boolean;
  isCurrentChordLinking?: boolean;
  isCurrentChordMoving?: boolean;
  contentFontSize?: number;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  onLinkedChordMenu: (anchor: HTMLElement) => void;
}

const Chord = ({
  chordData,
  mainKey,
  nonDeletable,
  onClick,
  isCopySourceChordChoosing,
  isLinkSourceChordChoosing,
  isLinkDestinationChordChoosing,
  isSameChordLinking,
  isCurrentChordLinking,
  contentFontSize,
  onLinkedChordMenu,
  isCurrentChordMoving,
}: ChordProps) => {
  const handleContextMenu = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (isSameChordLinking) {
      onLinkedChordMenu(event.currentTarget);
      event.preventDefault();
    }
  };

  const { isChordDeleting, isChordEditing, isChordMoving } = useChordsEditInstrumentsContext();

  return (
    <ChordWrapper
      nonDeletable={nonDeletable}
      isChordDeleting={isChordDeleting}
      contentFontSize={contentFontSize}
      isChordEditing={isChordEditing}
      isLinkSourceChordChoosing={isLinkSourceChordChoosing}
      isCopySourceChordChoosing={isCopySourceChordChoosing}
      isDestinationChordChoosing={isLinkDestinationChordChoosing}
      isSameChordLinking={isSameChordLinking}
      isCurrentChordLinking={isCurrentChordLinking}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      isChordMoving={isChordMoving}
      isCurrentChordMoving={isCurrentChordMoving}
    >
      {getChordText(chordData, mainKey)}
    </ChordWrapper>
  );
};

export default Chord;
