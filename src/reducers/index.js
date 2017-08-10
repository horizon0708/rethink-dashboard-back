"use strict"

import { combineReducers } from 'redux';
import { usersReducer } from './usersReducer';
import { graphReducer } from './graphReducer';
export default combineReducers({
    users: usersReducer,
    graph: graphReducer
})