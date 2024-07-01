import React, { Context } from 'react';
import { isMobile } from 'react-device-detect';

import PsalmsContent from '../components/PsalmsContent/desktop';
import PsalmsContentMobile from '../components/PsalmsContent/mobile';
import PsalmsDataProvider, { PsalmsContext } from '../providers/dataProviders/psalmsDataProvider';
import { DataProvider } from '../providers/types';
import MainView from '../views/MainView/MainView';

const PsalmsPage = () => {
  return (
    <PsalmsDataProvider>
      {isMobile ? (
        <PsalmsContentMobile />
      ) : (
        <MainView dataProviderContext={PsalmsContext as unknown as Context<DataProvider>}>
          <PsalmsContent />
        </MainView>
      )}
    </PsalmsDataProvider>
  );
};

export default PsalmsPage;
