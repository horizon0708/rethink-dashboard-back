"use strict"
import axios from 'axios';
import whilst from 'async/whilst';
import waterfall from 'async/waterfall';

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

export function toggleMemberships(membership, targetNumber, totalDuration){
    return dispatch =>{
        let userCount, difference;
        let userIds = [];
        let index = 0;
        waterfall([
            (cb) => {
                axios.get('/api/lateststats')
                    .then(res => {
                        userCount = res.data[0][`membership_eq_${membership}`];
                        dispatch({type:"TOGGLE_MEM_START"});
                        cb(null)
                    })
                    .catch(err => {
                        dispatch({type:"TOGGLE_MEM_ERROR"});
                        console.log(err);
                    })
            },
            (cb) => {
                difference =  targetNumber - userCount;
                axios.get(`/api/user?filter=membership_ne_${membership}&sort=age_desc&limit=${difference}`)
                    .then(res => {
                        userIds = res.data.data.map(x => x.id); // store list of ids to convert
                        cb(null);
                    })
                    .catch(err => {
                        dispatch({type:"TOGGLE_MEM_ERROR"});
                        console.log(err);
                    })
            }
        ], (err, res) => {
            console.log(`got ids of ${difference} users to process. Starting conversion.`)
            whilst(
                () => { //truth test: until userCount reaches the target number
                    return userCount < targetNumber
                },
                (callback) => {
                    setTimeout(() => {
                        let id = userIds[index];
                        axios.post(`/api/user/${id}`, { 'membership': membership })
                            .then(res => {
                                console.log(`updated ${id}'s membership to ${membership}`);
                            })
                            .catch(err => {
                                dispatch({type:"TOGGLE_MEM_ERROR"});
                                console.log(err);
                            });
                        userCount++;
                        index++;
                        callback();
                    }, totalDuration / difference);
                },
                (err, res) => { //result
                    if (err) { console.log(err); dispatch({type:"TOGGLE_MEM_ERROR"}); }
                    console.log(`conversion complete`)
                    dispatch({type:"TOGGLE_MEM_SUCCESS", payload: membership});
                })
        })
    }
}