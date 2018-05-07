import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from "redux";
import { Provider } from "react-redux";
import { connectionSetupReducer } from "./state/connectionSetup";
import { save, load } from "./state/persist";
import App from './App';

const store = createStore(
  connectionSetupReducer,
  load(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => save(store.getState()));

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);

