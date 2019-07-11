import React from 'react';
import { App } from '../../app';

interface IProps {
    style?: React.CSSProperties;
    show: boolean;
    type: string;
    timeout: Function;
}

export default function Alert(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, 'global', 'loading', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, 'global', 'loading', props)
        }
    }, [])
    return (
        <loading
            show={props.show}
            type={props.type}
            timeout={props.timeout}
        />
    );
};

 
