"use strict"
import axios from 'axios';


export function getAllUsers(){
    return (dispatch)=>{
        axios.get("/api/userbydate")
            .then(response=>{
                dispatch({type:"GET_ALL_USERS", payload:response.data})
            })
            .catch(err=>{
                dispatch({type:"GET_ALL_USERS_REJECTED", payload: err})
            })
    }
}