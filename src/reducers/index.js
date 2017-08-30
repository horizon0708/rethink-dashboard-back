"use strict"

import { combineReducers } from 'redux';
import { usersReducer } from './usersReducer';
import { graphReducer } from './graphReducer';
import { statusReducer } from './statusReducer';

export default combineReducers({
    users: usersReducer,
    graph: graphReducer,
    status: statusReducer
})