import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};
// get contacts
export const getUsers = data => get(url.GET_USERS, {params:data});

// add user
export const addNewUser = user => post(url.ADD_NEW_USER, user);

// update user
export const updateUser = user => put(url.UPDATE_USER, user);


export const getUserProfile = () => get(url.GET_USER_PROFILE);


export {
  getLoggedInUser,
  isUserAuthenticated
};
