import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authreducer from "./AuthReducer";

const NotiCount = localStorage.getItem("previousNotificationCount") || 0;
const userDatastring = localStorage.getItem("user");
const userData = JSON.parse(JSON.stringify(userDatastring));
const initialState = {
  NotiCount,
  userData,
};
console.log(initialState, "initialState");
const store = createStore(authreducer, initialState, applyMiddleware(thunk));

export { store };
