import React from 'react';

export default function connectRoute(WrappedComponent: React.ElementType, title: string) {
return class ConnectRoute extends React.Component<{location: string, [x:string]: any}> {
        shouldComponentUpdate(nextProps: any) {
            return nextProps.location !== this.props.location;
        }
        componentDidMount() {
            document.title = title;
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
