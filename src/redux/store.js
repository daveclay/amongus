import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { rootReducer, initialState } from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension'
import { init } from "./actions"

const middlewareEnhancer = applyMiddleware(thunkMiddleware)
const store = createStore(rootReducer, initialState, composeWithDevTools(middlewareEnhancer))

store.dispatch(init());

export default store
