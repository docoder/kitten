import React from 'react'
import { Layout } from '../../components'
import {inIframe} from '../../utils/Iframe'
import { App } from '../../app'

function _Index (): JSX.Element {
    const hide = inIframe()
    const app = React.useContext(App)
    return (
        <Layout
            config={app.config}
            hide={hide}
        />
    );
};
export const Index =  React.memo(_Index)