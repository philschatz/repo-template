export enum ACTION_TYPE {
    INCREMENT_COUNTER,
    DECREMENT_COUNTER
}

export function increment() {
    return {
        type: ACTION_TYPE.INCREMENT_COUNTER
    }
}

export function decrement() {
    return {
        type: ACTION_TYPE.DECREMENT_COUNTER
    }
}
