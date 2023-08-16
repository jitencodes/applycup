import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";
import toastr from "toastr";
//pass new generated access token here
const token = accessToken;

//apply base url for axios
const API_URL = process.env.REACT_APP_APIURL;

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] = token;

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data);
}

axiosApi.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (401 === error.response.status) {
      window.location.href = "/login"
  } else {
      return Promise.reject(error);
  }
});