"use strict"

export function usersReducer(state = {users:[{"name": "hey"}]}, action){
    switch(action.type){
        case "GET_ALL_USERS":
            return{
                ...state,
                users: [...action.payload]
            }
    }
    return state;
}
