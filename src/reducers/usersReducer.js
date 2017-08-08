"use strict"

export function usersReducer(state = {users:{all:[]}}, action){
    switch(action.type){
        case "GET_USERS":
            return{
                ...state,
                users:{all: [...action.payload]}
            }
        
        case "GET_ALL_USERS":
            return{
                ...state,
                users: {all: [...action.payload]},
                test: "test"
            }
        case "GET_USER_COUNT":
            return{
                ...state,
                count: action.payload
            }
    }
    return state;
}
