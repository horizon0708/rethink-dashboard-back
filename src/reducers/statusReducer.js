"use strict"

export function statusReducer(state = {generating: false, lastGeneration: null}, action){
    switch(action.type){
        case "TOGGLE_MEM_START":
            return{
                ...state,
                generating: true
            }
        
        case "TOGGLE_MEM_ERROR":
            return{
                ...state,
                generating: false
            }

        case "TOGGLE_MEM_SUCCESS":
            return{
                ...state,
                generating: false,
                lastGeneration: action.payload
            }
    }
    return state;
}
