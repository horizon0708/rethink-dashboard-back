"use strict"
import axios from 'axios';


export function getAllUsers(sortOpt, filterOpt){
    let endpoint = "/api/user";
    if(sortOpt){
        endpoint += '?sort='+encodeURIComponent(sortOpt);
    }
    if(filterOpt){
        filterOpt += '&filter='+encodeURIComponent(filterOpt);
    }

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

export function getUserCount(){
    return (dispatch)=>{
        dispatch({type:"GET_USER_COUNT"})
    }
}