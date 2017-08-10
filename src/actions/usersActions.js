"use strict"
import axios from 'axios';


export function getAllUsers(sortOpt, filterOpt){
    let endpoint = "/api/user";
    if(sortOpt){
        endpoint += '?sort='+encodeURIComponent(sortOpt);
    } else {
        endpoint += '?sort=joindate_desc';
    }
    if(filterOpt !== undefined){
        endpoint += '&filter='+encodeURIComponent(filterOpt);
    }
    console.log(endpoint);
    return (dispatch)=>{
        axios.get(endpoint)
            .then(response=>{
                dispatch({type:"GET_ALL_USERS", payload:response.data.data})
            })
            .catch(err=>{
                dispatch({type:"GET_ALL_USERS_REJECTED", payload: err})
            })
    }
}

export function updateFilterOpt(filterOpt){
    return dispatch=>{
        dispatch({type:"UPDATE_FILTER_OPT", payload: filterOpt});
    }
}

export function updateSortOpt(sortOpt){
    return dispatch=>{
        dispatch({type:"UPDATE_SORT_OPT", payload: sortOpt});
    }
}

export function getUniqueValues(){
    return dispatch => {
        axios.get('/api/valuelist')
        .then(res=>{
            dispatch({type:"GET_UNIQUE_VALUES", payload:res.data})
        })
        .catch(err=>{
            dispatch({type:"GET_UNIQUE_VALUES_REJECTED", payload: err})
        })
    }
}

export function getUserCount(){
    return (dispatch)=>{
        dispatch({type:"GET_USER_COUNT"})
    }
}