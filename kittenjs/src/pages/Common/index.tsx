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
            renderSiderTopSection={() => {
                const section = app.hooks.renderSiderTopSection.call(app.config.appKey)
                if (!section || (typeof section === 'string')) {
                    return null
                }else {
                    return section
                }
            }}
            renderRoutes={(RouteComponents: {Route: any, Switch: any, Redirect: any}, mainRender: Function) => {
                return app.hooks.renderCustomRoutes.call(app.config.appKey, RouteComponents, mainRender)
            }}
        />
    );
};
export const Index =  React.memo(_Index)