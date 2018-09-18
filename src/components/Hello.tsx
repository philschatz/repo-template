import * as React from 'react'

export interface IHelloProps { name: string }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Hello extends React.Component<IHelloProps, {}> {
    public render() {
        console.log('Test that line numbers in Jest match') // tslint:disable-line:no-console
        return <h1>Hello {this.props.name}!</h1>
    }
}
