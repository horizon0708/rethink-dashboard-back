"use strict"

export function graphReducer(state = {}, action) {
    switch (action.type) {
        case "UPDATE_ONE_TICK":
            const queryList = [
                'age_ge_18', //get querylist from server?
                'sex_eq_M',
                'sex_eq_F',
                'membership_eq_FREE',
                'membership_eq_ENTERPRISE',
                'membership_eq_PRO',
                'country_eq_UK',
                'country_eq_NZ',
                'country_eq_AU',
            ];
            let UpdatedValues = {};
            console.log(UpdatedValues);
            const payload = action.payload[0];
            for (var i = 0; i < queryList.length; i++) {
                const currentArr = [...state.live[queryList[i]]];
                const newVal = payload[queryList[i]];
                if (currentArr.length < 30) {
                    UpdatedValues[queryList[i]] = [...currentArr, newVal];
                } else {
                    UpdatedValues[queryList[i]] = [...currentArr.slice(1), newVal];
                }
                const timeArr = [...state.live.time];
                //const newTime = new Date().toTimeString().split(" ")[0];
                const newTime = new Date().toISOString();
                if (timeArr.length< 30){
                    UpdatedValues.time = [...timeArr, newTime];
                } else {
                    UpdatedValues.time = [...timeArr.slice(1), newTime];
                }

            }
            return {
                ...state,
                live: {
                    age_ge_18: UpdatedValues.age_ge_18,
                    country_eq_AU: UpdatedValues.country_eq_AU,
                    country_eq_NZ: UpdatedValues.country_eq_NZ,
                    country_eq_UK: UpdatedValues.country_eq_UK,
                    membership_eq_ENTERPRISE: UpdatedValues.membership_eq_ENTERPRISE,
                    membership_eq_PRO: UpdatedValues.membership_eq_PRO,
                    membership_eq_FREE: UpdatedValues.membership_eq_FREE,
                    sex_eq_M: UpdatedValues.sex_eq_M,
                    sex_eq_F: UpdatedValues.sex_eq_F,
                    time: UpdatedValues.time
                }
            }
        case "UPDATE_LATEST":
            return {
                ...state,
                latest: action.payload
            }
        case "INITIALISE_ARRAY": //TODO: fix the array hard code; dont need this, initialise at serverside
            return {
                ...state,
                live: {
                    age_ge_18: [],
                    country_eq_AU: [],
                    country_eq_NZ: [],
                    country_eq_UK: [],
                    membership_eq_ENTERPRISE: [],
                    membership_eq_PRO: [],
                    membership_eq_FREE: [],
                    sex_eq_M: [],
                    sex_eq_F: [],
                    time: []
                }
            }
    }
    return state;
}
