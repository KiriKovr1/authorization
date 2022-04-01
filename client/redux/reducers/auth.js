import axios from "axios"
import Cookies from 'universal-cookie'  

import { history } from '..'


const UPDATE__LOGIN = 'UPDATE__LOGIN'
const UPDATE__PASSWORD = 'UPDATE__PASSWORD'
const LOGIN = 'LOGIN'
const cookies = new Cookies()  

const initialState = {
  email: '',
  password: '',
  token: cookies.get('token'),
  user: {}
}
/* eslint-disable default-param-last */
export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE__LOGIN: {
      return { ...state, email: action.login }
    }
    case UPDATE__PASSWORD: {
      return { ...state, password: action.password }
    }
    case LOGIN: {
      return { ...state, token: action.token, password: '', user: action.user }
    }
    default:
      return state
  }
}

export function updateLogin(value) {
  return { type: UPDATE__LOGIN, login: value }
}
export function updatePassword(value) {
  return { type: UPDATE__PASSWORD, password: value }
}
export function signin() {
  return (dispatch, getState) => {
    const { email, password } = getState().auth
    axios.post('/api/v1/auth', { email, password })
      .then(r => r.data)
      .then(data => {
        console.log({ fromRedux: data })
        dispatch({ type: LOGIN, token: data.token, user: data.user })
        history.push('/')
      })
  }
}

