import React from 'react'
import { App, ActionMeta } from '../../app'
import { Pages } from '../../pages'

interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    meta: ActionMeta;
    buttonKey: string;
    forceUpdate: Function;
}

function _Button(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'button', props.buttonKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'button', props.buttonKey, props)
        }
    }, [])
    const { showModal } = Pages.useContainer()
    const Comp = app.ui? app.ui.Button : null
    return (
        <Comp 
        {...props.meta}
        style={{
            ...props.style,
        }} 
        onClick={() => {
            app.hooks.beforeButtonClick.call(app.config.appKey, props.pageKey, props.buttonKey)
            if (props.meta.modal && props.meta.modal.length > 0) {
                showModal(props.pageKey, props.meta.modal)
            }
        }} />
    );
};

export const Button = React.memo(_Button)