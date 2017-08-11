import axios from 'axios';

export function updateOneTick(latest) {
    if (!latest) {
        return dispatch => {
            axios.get('/api/lateststats')
                .then(res => {
                    dispatch({ type: "UPDATE_ONE_TICK", payload: res.data })
                })
                .catch(err => {
                    dispatch({ type: "UPDATE_ONE_TICK_FAILED", payload: err })
                })
        }
    } 
    return dispatch=> dispatch({type: "UPDATE_ONE_TICK", payload: latest})
}



export function updateLatest() {
    return dispatch => {
        axios.get('/api/lateststats')
            .then(res => {
                dispatch({ type: "UPDATE_LATEST", payload: res.data })
            })
            .catch(err => {
                dispatch({ type: "UPDATE_LATEST_FAILED", payload: err })
            })
    }
}

export function initialiseArray(latest) {
    return dispatch => {
        dispatch({ type: "INITIALISE_ARRAY", payload: latest })
    }
}