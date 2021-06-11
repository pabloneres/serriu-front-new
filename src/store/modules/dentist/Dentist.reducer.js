import produce from "immer";

export default function clinic(state = {
    dentists: [],
}, action) {
  switch (action.type) {
    case "INDEX":
      return {...state, dentists: action.payload}
    default:
      return state;
  }
}
