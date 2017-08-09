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
                users: {all: [...action.payload]}
            }
        case "GET_USER_COUNT":
            return{
                ...state,
                count: action.payload
            }

        case "GET_UNIQUE_VALUES":
            return{
                ...state,
                uniqueValues: action.payload
            }
    }
    return state;
}
