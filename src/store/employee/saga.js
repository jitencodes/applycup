import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_USERS, GET_USER_PROFILE , ADD_NEW_USER , UPDATE_USER } from "./actionTypes"

import {
  getUsersSuccess,
  getUsersFail,
  getUserProfileSuccess,
  getUserProfileFail,
  addUserFail,
  addUserSuccess,
  updateUserSuccess,
  updateUserFail
} from "./actions"

//Include Both Helper File with needed methods
import { getUsers, getUserProfile , addNewUser, updateUser } from "../../helpers/backend_helper"

function* fetchUsers({ payload: user}) {
  try {
    const response = yield call(getUsers,user)
    yield put(getUsersSuccess(response))
  } catch (error) {
    yield put(getUsersFail(error))
  }
}

function* fetchUserProfile() {
  try {
    const response = yield call(getUserProfile)
    yield put(getUserProfileSuccess(response))
  } catch (error) {
    yield put(getUserProfileFail(error))
  }
}

function* onUpdateUser({ payload: user }) {
  try {
    const response = yield call(updateUser, user)
    yield put(updateUserSuccess(response))
  } catch (error) {
    yield put(updateUserFail(error))
  }
}

function* onAddNewUser({ payload: user }) {

  try {
    const response = yield call(addNewUser, user)

    yield put(addUserSuccess(response))
  } catch (error) {

    yield put(addUserFail(error))
  }
}

function* contactsSaga() {
  yield takeEvery(GET_USERS, fetchUsers)
  yield takeEvery(GET_USER_PROFILE, fetchUserProfile)
  yield takeEvery(ADD_NEW_USER, onAddNewUser)
  yield takeEvery(UPDATE_USER, onUpdateUser)
}

export default contactsSaga;
