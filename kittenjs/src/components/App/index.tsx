import React from 'react'
import { ConfigType } from '../../app'
import { Plugin } from '../../plugins'

export interface AppProps {
    style?: React.CSSProperties
    className?: string
    config: ConfigType
    plugins: Plugin[]
    debugHooks?: string[]
    hide: boolean
}

function _Layout(props: AppProps): JSX.Element {
    return (
        <k_layout
            style={{
                ...props.style,
            }}
            className={props.className}
            config={props.config}
            plugins={props.plugins}
            debugHooks={props.debugHooks}
            hide={props.hide}
        />
    );
};

export const App = React.memo(_Layout)