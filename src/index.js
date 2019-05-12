import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-client-preset';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import App from './App';

import './index.css';

// Websocket configuration
const wsLink = new WebSocketLink({

  uri: 'wss://subscriptions.graph.cool/v1/cjvhijs604prd0110qxrwktfq',
  options: {
    reconnect: true
  }
});

// HTTP Connection for request response
const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjvhijs604prd0110qxrwktfq' });

const link = split(
//The split method takes 3 arguments.
//The first is a test that returns a boolean.
//If the boolean value is true, the request is forwarded to the second (wsLink) argument.
//If false, it's forwarded to the third (httpLink) argument.

  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);

    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
