import React from 'react';
import { App } from '../../app';

interface IProps {
    style?: React.CSSProperties;
    type: string;
    message?: string;
    description: string;
    onClose: Function;
}

export default function Alert(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, 'global', 'alert', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, 'global', 'alert', props)
        }
    }, [])
    return (
        <alert 
            type={props.type}
            message={props.message}
            description={props.description}
            onClose={props.onClose}
        />
    );
};

