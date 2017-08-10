"use strict"

export function graphReducer(state = {}, action) {
    switch (action.type) {
        case "UPDATE_ONE_TICK":
            const queryList = [
                'age_ge_18', //get querylist from server?
                'sex_eq_M',
                'sex_eq_F',
                'age_gt_50',
                'membership_eq_FREE',
                'membership_eq_ENTERPRISE',
                'membership_eq_PRO',
                'country_eq_UK',
                'country_eq_NZ',
                'country_eq_AU',
            ];
            let UpdatedValues;
            const payload = action.payload[0];
            for (var i = 0; i < queryList.length; i++) {
                const currentArr = [...state[queryList[i]]];
                const newVal = payload[queryList[i]];
                UpdatedValues[queryList[i]] = [...currentArr.splice(0,1), newVal];
            }
            return {
                ...state,
                age_ge_18: UpdatedValues.age_ge_18,
                country_eq_AU: UpdatedValues.country_eq_AU,
                country_eq_NZ: UpdatedValues.country_eq_NZ,
                country_eq_UK: UpdatedValues.country_eq_UK,
                membership_eq_ENTERPRISE: UpdatedValues.membership_eq_ENTERPRISE,
                membership_eq_PRO: UpdatedValues.membership_eq_PRO,
                membership_eq_FREE: UpdatedValues.membership_eq_FREE,
                sex_eq_M: UpdatedValues.sex_eq_M,
                sex_eq_F: UpdatedValues.sex_eq_F
            }
        case "UPDATE_LATEST":
            return{
                ...state,
                latest: action.payload
            }
    }
    return state;
}
