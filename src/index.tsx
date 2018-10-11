import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { Hello } from './components/Hello'
import { increment } from './store/actions'
import createStore from './store/createStore'
import { throwErrorAfterDelay, throwErrorNow } from './testErrorHandling'

// The test harness needs to define this variable globally (so this code can set it)
declare var TEST_COMPONENTS: any

const store = createStore()

// There is probably a better way to handle this
if ('IS_TESTING' in window) {
    TEST_COMPONENTS = {
        ReactDOM,
        React,
        Provider,
        store,
        Hello,
        throwErrorNow,
        throwErrorAfterDelay
    }
    if (TEST_COMPONENTS) {
        // just to make TypeScript happy
    }
} else {
    ReactDOM.render(
        <Provider store={store}>
            <Hello name='ExampleUser' />
        </Provider>
        ,
        document.getElementById('mainContentArea')
    )
    store.dispatch(increment())
}
