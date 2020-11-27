import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { StateProvider } from './state';
import { initialState } from './state/initialState';
import { reducer } from './state/reducer';

import './index.css';

ReactDOM.render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById('root')
);
