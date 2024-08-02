import 'animate.css';
import React from 'react';

import { usePsalmsBooksData } from '../../../providers/dataProviders/psalmsDataProvider/PsalmsBooksProvider';

import PsalmsContextMenuProvider from './PsalmsContextMenuProvider';
import ReorderablePsalmList from './ReorderablePsalmList';
import { PsalmSelectWrapper } from './styled';
import VirtualizedPsalmList from './VirtualizedPsalmList';

const PsalmSelect = () => {
  const { currentPsalmBook } = usePsalmsBooksData();

  const canBeReordered = !!currentPsalmBook?.isFavourite;

  return (
    <PsalmSelectWrapper>
      <PsalmsContextMenuProvider>
        {canBeReordered ? <ReorderablePsalmList /> : <VirtualizedPsalmList />}
      </PsalmsContextMenuProvider>
    </PsalmSelectWrapper>
  );
};

export default PsalmSelect;
