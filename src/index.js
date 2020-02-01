import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {preloadReady} from 'react-loadable';
import cookie from 'react-cookies';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {ApolloProvider} from 'react-apollo';
import {createUploadLink} from 'apollo-upload-client';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import {split} from 'apollo-link';
import {setContext} from 'apollo-link-context';
import ApolloClient from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {LOCAL_SERVER_URI, LOCAL_WS_URI} from 'config';

const token = cookie.load('token');

const httpLink = createUploadLink({
  uri: LOCAL_SERVER_URI,
});

const wsLink = new WebSocketLink({
  uri: LOCAL_WS_URI,
  options: {
    reconnect: true,
    connectionParams: {
      authentication: token ? `Bearer ${token}` : '',
    },
  },
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      authentication: token ? `Bearer ${token}` : '',
    },
  };
});

const link = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

window.onload = async () => {
  await preloadReady();

  ReactDOM.render(
    <ApolloProvider client={client}>
      <Router basename="/">
        <App />
      </Router>
    </ApolloProvider>,
    document.getElementById('root')
  );
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
