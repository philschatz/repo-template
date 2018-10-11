import { createStore } from 'redux'
import reducers, { IActionPayload, IStoreState } from './reducers'

export default () => createStore<IStoreState, IActionPayload, null/*unsure about these types*/, null>(reducers)
