import React from 'react'
import { App, ActionMeta } from '../../app'
import Pages from '../../pages'

interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    meta: ActionMeta;
    buttonKey: string;
}

export default function Buttons(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'button', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'button', props)
        }
    }, [])
    const { showModal } = Pages.useContainer()
    return (
        <k_button 
        style={{
            ...props.style,
        }}
        {...props.meta} 
        onClick={() => {
            if (props.meta.modal && props.meta.modal.length > 0) {
                showModal(props.pageKey, props.meta.modal)
            }
        }} />
    );
};
