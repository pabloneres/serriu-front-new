import produce from "immer";

export const actions = {
    logout: () => ({ type: 'LOGOUT' }),
};

const inicial = {
    token: null,
    user: null
}

export default function user(state = {
    token: null,
    user: null
}, action) {
  switch (action.type) {
    case "LOGIN":
        return {...state, token: action.payload};
    case "USER":
        return {...state, user: action.payload}
    case "LOGOUT":
        return state = inicial
    default:
      return state;
  }
}
