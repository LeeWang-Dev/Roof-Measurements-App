import { SET_TOKEN, REMOVE_TOKEN} from "../actionTypes";

export const setToken = newValue => ({
    type: SET_TOKEN,
    payload: { newValue }
});

export const removeToken = () => ({
    type: REMOVE_TOKEN,
    payload: {}
});
