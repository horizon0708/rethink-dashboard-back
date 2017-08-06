"use strict"
import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers/index';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';
import logger from 'redux-logger';
import routes from './routes';


// create store
const middleware = applyMiddleware(thunk, logger);
const store = createStore(reducers, middleware);

const Routes = (
    <Provider store={store}>
        {routes}
    </Provider>
)


render(Routes, document.getElementById('app'))