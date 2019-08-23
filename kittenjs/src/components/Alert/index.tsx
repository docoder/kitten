import React from 'react';
import { App } from '../../app';

interface IProps {
    style?: React.CSSProperties;
    type: string;
    message?: string;
    description: string;
    onClose: Function;
}

function _Alert(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, 'global', 'alert', props.type, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, 'global', 'alert', props.type, props)
        }
    }, [])
    const Comp = app.ui? app.ui.Alert : null
    return (
        <Comp
            type={props.type}
            message={props.message}
            description={props.description}
            onClose={props.onClose}
        />
    );
};

export const Alert = React.memo(_Alert)