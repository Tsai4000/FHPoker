import { createStore } from 'redux'
import rootReducers from '../reducer/rootReducer'

export const store = createStore(rootReducers)