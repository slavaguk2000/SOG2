import React from 'react';

import { ApolloClient, ApolloProvider, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import BackendStatusChecker from './components/backendStatusChecker';
import reportWebVitals from './reportWebVitals';
import cache from './utils/gql/cache';
import { BACKEND_GRAPHQL_HTTP_URL, BACKEND_GRAPHQL_WS_URL } from './utils/hostUtils';

const httpLink = new HttpLink({
  uri: BACKEND_GRAPHQL_HTTP_URL,
});

const wsLink = new WebSocketLink({
  uri: BACKEND_GRAPHQL_WS_URL,
  options: {
    reconnect: true,
  },
});

const webSocketImpl = wsLink?.subscriptionClient;

const isWebSocketConnected = () => {
  return webSocketImpl.status === webSocketImpl.wsImpl.OPEN;
};

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
  cache,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BackendStatusChecker isWebSocketConnected={isWebSocketConnected}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BackendStatusChecker>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
