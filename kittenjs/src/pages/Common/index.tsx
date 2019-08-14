import React from 'react'
import { App } from '../../components'
import {inIframe} from '../../utils/Iframe'
import { ConfigType } from '../../app'
import { Plugin } from '../../plugins'

interface IProps {
    config: ConfigType
    plugins: Plugin[]
    debugHooks?: string[]
}

function _Index (props: IProps): JSX.Element {
    const hide = inIframe()
    const config = props.config
    const plugins = props.plugins
    const debugHooks = props.debugHooks
    return (
        <App
            config={config}
            plugins={plugins}
            debugHooks={debugHooks}
            hide={hide}
        />
    );
};
export const Index =  React.memo(_Index)