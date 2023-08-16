import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
} from "./actionTypes"

import toastr from "toastr";
let api_url = process.env.REACT_APP_APIURL
export const loginUser = async (user, history) => {
  const response = await fetch(`${api_url}/auth/index_post`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "emp_id": user['emp_id'],
      "password": user['password']
    }),
  })
  if (response) {
    const data2 = await response.json();
    if (response.status >= 400) {
      toastr.error(data2.status)
    }
    // or 
    if (response.status == 200) {
      if (data2) {
        toastr.success('Login successful.')
        let object = data2;
        localStorage.setItem('authUser', JSON.stringify(object));
        location.href = "/dashboard"
      } else {
        toastr.error(data2.message);
      }
    }
  } else {
    toastr.error('Something wrong!');
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  }
}
