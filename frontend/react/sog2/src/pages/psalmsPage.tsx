import React, { Context } from 'react';
import { isMobile } from 'react-device-detect';

import PsalmsContent from '../components/PsalmsContent/desktop';
import PsalmsContentMobile from '../components/PsalmsContent/mobile';
import PsalmsDataProvider from '../providers/dataProviders/psalmsDataProvider';
import PsalmsProvider, { PsalmsContext } from '../providers/dataProviders/psalmsDataProvider/PsalmsProvider';
import { DataProvider } from '../providers/types';
import MainView from '../views/MainView/MainView';

const PsalmsPage = () => {
  return (
    <PsalmsDataProvider>
      <PsalmsProvider setPsalmsBookIdSelected={() => true}>
        {isMobile ? (
          <PsalmsContentMobile />
        ) : (
          <MainView dataProviderContext={PsalmsContext as unknown as Context<DataProvider>}>
            <PsalmsContent />
          </MainView>
        )}
      </PsalmsProvider>
    </PsalmsDataProvider>
  );
};

export default PsalmsPage;
