"use strict"
import axios from 'axios';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import reducers from './src/reducers/index';
import routes from './src/routes';
import waterfall from 'async/waterfall';

function handleRender(req, res) {
    let userInit, statsInit;

    waterfall([
        function(cb){
            axios.get('https://rethink-dashboard.herokuapp.com/api/user')
            .then(function(response){
                userInit  = {"users":  response.data.data, 'filter':'age_ge_18&age_le_100', 'sort':'joindate_desc'};
                cb();
            })
            .catch(function(err){
                console.log('error loading initial user data');
                cb();
            });
        },
        function(cb){
            axios.get('https://rethink-dashboard.herokuapp.com/api/lateststats')
            .then(function(response){
                statsInit = {"latest": response.data};
                cb();
            })
            .catch(function(err){
                console.log('error loading initial stats data');
                statsInit = {"latest": []};
                cb();
            })
        }
    ],function(error){
        const store = createStore(reducers,{
            "users": userInit,
            "graph": statsInit,
            "status": {generating: false, lastGeneration: null}
        });
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
    });
}

module.exports = handleRender;