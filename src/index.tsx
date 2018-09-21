import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Hello } from './components/Hello'
import { throwErrorAfterDelay, throwErrorNow } from './testErrorHandling'

// The test harness needs to define this variable globally (so this code can set it)
declare var TEST_COMPONENTS: any

// There is probably a better way to handle this
if ('IS_TESTING' in window) {
    TEST_COMPONENTS = {
        ReactDOM,
        React,
        Hello,
        throwErrorNow,
        throwErrorAfterDelay
    }
    if (TEST_COMPONENTS) {
        // just to make TypeScript happy
    }
} else {
    ReactDOM.render(
        <Hello name='ExampleUser' />,
        document.getElementById('mainContentArea')
    )
}
