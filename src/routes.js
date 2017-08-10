"use strict"
import React from 'react';
import { render } from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import Main from './main';
import UserList from './components/userList';

const routes = (
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={UserList} />

            </Route>
        </Router>
)

                // <Route path="/admin" component={BookForm} />
                // <Route path="/cart" component={Cart} />

export default routes;