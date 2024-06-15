import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Tab, Tabs } from '@mui/material';

import { TabsFieldWrapper } from './styled';

const getKeyFprLocalStorageSavedTabParams = (path: string) => `savedTabParams.${path}`;

const TabsField: FC = () => {
  const navigate = useNavigate();

  const { pathname, search } = useLocation();

  const handleChangeTab = (e: React.SyntheticEvent, route: string) => {
    e.preventDefault();
    if (pathname === route) {
      return;
    }
    localStorage.setItem(getKeyFprLocalStorageSavedTabParams(pathname), search);
    const currentSavedParams = localStorage.getItem(getKeyFprLocalStorageSavedTabParams(route));
    navigate(`${route}${currentSavedParams ?? ''}`);
  };

  return (
    <TabsFieldWrapper>
      <Tabs onChange={handleChangeTab} value={pathname}>
        <Tab label={'Bible'} value="/bible" />
        <Tab label={'Sermon'} value="/sermon" />
        <Tab label={'Psalms'} value="/psalms" />
      </Tabs>
    </TabsFieldWrapper>
  );
};

export default TabsField;
