import React, { useState } from 'react';

import { useQuery } from '@apollo/client';
import { v4 } from 'uuid';

import { search } from 'src/utils/gql/queries';

import { Query, QuerySearchArgs } from '../../utils/gql/types';

const TestView = () => {
  const [searchPattern, setSearchPattern] = useState('бегущий');
  const { data } = useQuery<Pick<Query, 'search'>, QuerySearchArgs>(search, {
    variables: {
      searchPattern,
    },
    fetchPolicy: 'cache-first',
  });

  return (
    <div className="App">
      <div>
        <input value={searchPattern} onChange={({ target }) => setSearchPattern(target.value)} />
      </div>
      <div
        style={{
          marginTop: '50px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data?.search.map(({ content }) => (
          <div style={{ margin: '10px', border: '3px solid black', borderRadius: '5px' }} key={v4()}>
            {content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestView;
