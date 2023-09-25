import React from 'react';

import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8000/',
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query {
        search(searchPattern: "Ирод") {
          content
        }
      }
    `,
  })
  .then((result) => console.log(result));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
