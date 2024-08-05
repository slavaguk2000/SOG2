import React, { useState } from 'react';

import CoupletSelect from './CoupletSelect';
import PsalmBookSelect from './PsalmBookSelect';
import PsalmSelect from './PsalmSelect';
import { PsalmsContentWrapper } from './styled';

const PsalmsContent = () => {
  const [isCurrentBookFavourite, setIsCurrentBookFavourite] = useState<boolean>(false);

  return (
    <PsalmsContentWrapper>
      <PsalmBookSelect
        setIsCurrentBookFavourite={setIsCurrentBookFavourite}
        isCurrentBookFavouriteState={isCurrentBookFavourite}
      />
      <PsalmSelect isCurrentBookFavourite={isCurrentBookFavourite} />
      <CoupletSelect />
    </PsalmsContentWrapper>
  );
};

export default PsalmsContent;
