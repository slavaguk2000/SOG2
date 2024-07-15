import React, { Context } from 'react';
import { isMobile } from 'react-device-detect';

import PsalmsContent from '../components/PsalmsContent/desktop';
import PsalmsContentMobile from '../components/PsalmsContent/mobile';
import PsalmsDataProvider from '../providers/dataProviders/psalmsDataProvider';
import { CurrentPsalmContext } from '../providers/dataProviders/psalmsDataProvider/CurrentPsalmProvider';
import SearchContextProvider from '../providers/searchProvider';
import { DataProvider } from '../providers/types';
import { TabType } from '../utils/gql/types';
import MainView from '../views/MainView/MainView';

const PsalmsPage = () => {
  return (
    <PsalmsDataProvider>
      <SearchContextProvider tabType={TabType.Psalm}>
        {isMobile ? (
          <PsalmsContentMobile />
        ) : (
          <MainView dataProviderContext={CurrentPsalmContext as unknown as Context<DataProvider>}>
            <PsalmsContent />
          </MainView>
        )}
      </SearchContextProvider>
    </PsalmsDataProvider>
  );
};

export default PsalmsPage;
