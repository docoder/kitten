import React from 'react'
import { App, ActionMeta } from '../../app'
import { Pages } from '../../pages'

interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    meta: ActionMeta;
    checkboxKey: string;
}

function _Checkbox(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'checkbox', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'checkbox', props)
        }
    }, [])
    const { setParams } = Pages.useContainer()
    const Comp = app.ui? app.ui.Checkbox : null
    return (
        <Comp 
        style={{
            ...props.style,
        }}
        title={props.meta.label}
        onChange={(value: any) => {
            app.hooks.beforeCheckboxChange.call(app.config.appKey, props.pageKey, props.checkboxKey, value)
            if (props.meta.params && props.meta.params.set) {
                setParams(props.pageKey, props.checkboxKey, {checked: value.target.checked})
            }
        }}
        />
    );
};

export const Checkbox = React.memo(_Checkbox)