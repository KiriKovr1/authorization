import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import auth from './auth'
import rooms from './rooms'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    rooms
  })

export default createRootReducer
