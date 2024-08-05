import 'animate.css';
import React from 'react';

import PsalmsContextMenuProvider from './PsalmsContextMenuProvider';
import ReorderablePsalmList from './ReorderablePsalmList';
import { PsalmSelectWrapper } from './styled';
import VirtualizedPsalmsList from './VirtualizedPsalmsList';

interface PsalmSelectProps {
  isCurrentBookFavourite?: boolean;
}

const PsalmSelect = ({ isCurrentBookFavourite }: PsalmSelectProps) => {
  const canBeReordered = !!isCurrentBookFavourite;

  return (
    <PsalmSelectWrapper>
      <PsalmsContextMenuProvider>
        {canBeReordered ? <ReorderablePsalmList /> : <VirtualizedPsalmsList />}
      </PsalmsContextMenuProvider>
    </PsalmSelectWrapper>
  );
};

export default PsalmSelect;
