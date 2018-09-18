import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as TestUtils from 'react-dom/test-utils' // tslint:disable-line:no-submodule-imports
import { Hello } from '../src/components/Hello'

it('says hello to the user', () => {
  // Render a checkbox with label in the document
    const hello = TestUtils.renderIntoDocument(
    <Hello name='TestUser' />
  )

    const helloNode = ReactDOM.findDOMNode(hello)

  // Verify that it's Off by default
    expect(helloNode.textContent).toEqual('Hello TestUser!')

    console.log('Test that sourcemaps work in Jest (should show the correct line number)') // tslint:disable-line:no-console

  // Simulate a click and verify that it is now On
    TestUtils.Simulate.change(
    TestUtils.findRenderedDOMComponentWithTag(hello, 'h1')
  )
})
