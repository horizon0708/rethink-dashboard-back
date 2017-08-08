"use strict"

export function usersReducer(state = {users:[]}, action){
    switch(action.type){
        case "GET_USERS":
            return{
                ...state,
                users: [...action.payload]
            }
        
        case "GET_ALL_USERS":
            return{
                ...state,
                users: [...action.payload]
            }
        case "GET_USER_COUNT":
            return{
                ...state,
                count: action.payload
            }
    }
    return state;
}
