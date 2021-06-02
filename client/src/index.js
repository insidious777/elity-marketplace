import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import rootReducer from './redux/rootReducer'
import reportWebVitals from './reportWebVitals';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {createStore} from 'redux';
import {Provider} from "react-redux";

const store = createStore(rootReducer);
const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
