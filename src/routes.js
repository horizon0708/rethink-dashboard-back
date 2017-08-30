"use strict"
import React from 'react';
import { render } from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import Main from './main';
import UserList from './components/userList';
import Dashboard from './components/userDashboard';
import AboutPage from './components/aboutPage';

const routes = (
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <IndexRoute component={Dashboard} />
                <Route path="userlist" component={UserList} />
                <Route path="dashboard" component={Dashboard} />
                <Route path="about" component={AboutPage} />
            </Route>
        </Router>
)
export default routes;