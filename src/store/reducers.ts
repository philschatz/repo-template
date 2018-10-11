import { fromJS as fromJsUntyped } from 'immutable'
// import { combineReducers } from 'redux'
import { ACTION_TYPE } from './actions'

// ============= The magic sauce ============== //
interface ImmutableObject<T> {
    get<P extends keyof T>(key: P): T[P] extends Array<infer U> ? ImmutableList<U> : T[P] extends object ? ImmutableObject<T[P]> : T[P]
    update<P extends keyof T>(
        key: P,
        valFn: (
            oldVal: T[P] extends Array<infer U> ? ImmutableList<U> : T[P] extends object ? ImmutableObject<T[P]> : T[P]
            ) => T[P] extends Array<infer U> ? ImmutableList<U> : T[P] extends object ? ImmutableObject<T[P]> : T[P]
        ): ImmutableObject<T>
}

interface ImmutableList<T> {
    count(): number
    get(index: number): T extends object ? ImmutableObject<T> : T
}

// The fromJS() API from immutable.js
function fromJS<T>(obj: T): ImmutableObject<T> {
    return fromJsUntyped(obj)
}
// ============= End magic sauce =============== //

// Declare the type of the State object
export type IStoreState = ImmutableObject<{
    count: number
}>

// Declare the value of the initial state
const INITIAL_STATE: IStoreState = fromJS({
    count: 0
})

export interface IActionPayload {type: ACTION_TYPE}

export const counter = (state = INITIAL_STATE, action: IActionPayload) => {
    switch (action.type) {
        case ACTION_TYPE.INCREMENT_COUNTER:
            return state.update('count', (value) => value + 1)
        case ACTION_TYPE.DECREMENT_COUNTER:
            return state.update('count', (value) => value - 1)
        default:
            return state
    }
}

// export default combineReducers<IStoreState, IActionPayload>({ count })
export default counter
