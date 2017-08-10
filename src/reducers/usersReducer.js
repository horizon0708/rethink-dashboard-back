"use strict"

export function usersReducer(state = {users:[]}, action){
    switch(action.type){
        case "GET_USERS":
            return{
                ...state,
                users:{all: [...action.payload]}
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

        case "GET_UNIQUE_VALUES":
            return{
                ...state,
                uniqueValues: action.payload
            }

        case "UPDATE_FILTER_OPT":
            return{
                ...state,
                filter: action.payload
            }
        case "UPDATE_SORT_OPT":
            return{
                ...state,
                sort: action.payload
            }
    }
    return state;
}
