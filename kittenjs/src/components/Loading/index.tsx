import React from 'react';
import { App } from '../../app';

interface IProps {
    style?: React.CSSProperties;
    show: boolean;
    type: string;
    timeout: Function;
}

function _Loading(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, 'global', 'Loading', props.type, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, 'global', 'Loading', props.type, props)
        }
    }, [])
    const Comp = app.ui? app.ui.Loading : null
    return (
        <Comp
            show={props.show}
            type={props.type}
            timeout={props.timeout}
        />
    );
};
export const Loading = React.memo(_Loading)
