import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducers from './reducers';

import './index.css';
import App from './components/App';

ReactDOM.render(
    <Provider
        store={createStore(
            Reducers,
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )}
    >
        <App />
    </Provider>,
    document.getElementById('root')
);
