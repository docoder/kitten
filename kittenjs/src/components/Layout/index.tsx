import React from 'react'
import { UIType, ConfigType } from '../../app'
import { Plugin } from '../../plugins'
import { App } from '../../app';

export interface AppProps {
    style?: React.CSSProperties
    className?: string
    config: ConfigType
    hide: boolean
    renderRoutes?: Function
    renderSiderTopSection?: Function
    renderHeaderActions?: Function
}

function _Layout(props: AppProps): JSX.Element {
    const app = React.useContext(App)
    const Comp = app.ui? app.ui.Layout : null
    return (
        <Comp
            style={{
                ...props.style,
            }}
            className={props.className}
            config={props.config}
            hide={props.hide}
            renderRoutes={props.renderRoutes}
            renderHeaderActions={props.renderHeaderActions}
            renderSiderTopSection={props.renderSiderTopSection}
        />
    );
};

export const Layout = React.memo(_Layout)