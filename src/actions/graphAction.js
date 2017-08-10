import axios from 'axios';

export function UpdateOneTick(latest){
    return dispatch => {
        dispatch({type: "UPDATE_ONE_TICK", payload: latest});
    }
}

export function UpdateLatest(){
    return dispatch => {
        axios.get('/api/lateststats')
        .then(res=>{
            dispatch({type:"UPDATE_LATEST", payload:res.data})
        })
        .catch(err=>{
            dispatch({type:"UPDATE_LATEST_FAILED", payload: err})
        })
    }
}