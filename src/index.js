import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger';
import './index.css';
import * as serviceWorker from './serviceWorker';

import linksReducer from './store';

import App from './App';
ReactDOM.render(
  <Provider store={createStore(linksReducer, applyMiddleware(logger))}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();