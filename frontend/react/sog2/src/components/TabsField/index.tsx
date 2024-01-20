import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Tab, Tabs } from '@mui/material';

import { TabsFieldWrapper } from './styled';

const TabsField: FC = () => {
  const navigate = useNavigate();

  const handleChangeTab = (e: React.SyntheticEvent, route: string) => {
    e.preventDefault();
    navigate(route);
  };

  const { pathname } = useLocation();

  return (
    <TabsFieldWrapper>
      <Tabs onChange={handleChangeTab} value={pathname}>
        <Tab label={'Bible'} value="/bible" />
        <Tab label={'Sermon'} value="/sermon" />
        {/*<Tab label={'Songs'} />*/}
      </Tabs>
    </TabsFieldWrapper>
  );
};

export default TabsField;
