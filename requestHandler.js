"use strict"
import axios from 'axios';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import reducers from './src/reducers/index';
import routes from './src/routes';


function handleRender(req, res) {
    axios.get('http://localhost:3002/api/user')
        .then(function (response) {
            // Create redux store on server
            const store = createStore(reducers, { "users":{"users":  response.data.data, 'filter':'age_ge_18&age_le_100', 'sort':'joindate_desc'}});
            // get initial state from teh store need to careful ith input validation
            const initialState = JSON.stringify(store.getState()).replace(
                /<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
            // implement react rotuer to intercept client requests and define what to do with them
            const Routes = {
                routes: routes,
                location: req.url
            }
            match(Routes, function (error, redirect, props) {
                if (error) {
                    res.status(500).send("ERROR FULFILLING THE REQUEST");
                } else if (redirect) {
                    res.status(302, redirect.pathname + redirect.search)
                } else if (props) {
                    const reactComponent = renderToString(
                        <Provider store={store}>
                            <RouterContext {...props} />
                        </Provider>
                    )
                    res.status(200).render('index', { reactComponent, initialState })
                } else {
                    res.status(404).send('Not Found')
                }
            })
        })
        .catch(function (err) {
            console.log('#initial Server-side rendering error', err);
        })


}

module.exports = handleRender;