import React from 'react';
import { Plugin, AppHooks } from 'kittenjs'
export default class OtherRoutePagePlugin implements Plugin {
    apply(hooks: AppHooks) {
        hooks.renderCustomRoutes.tap('OtherRoutePage--renderCustomRoutes', (appkey: string, RouteComponents: any, mainRender: Function) => {
            const {Route, Redirect} = RouteComponents
            return (
                <>
                    <Route exact path="/" component={() => <Redirect to="/main" />} />
                    <Route path="/login" component={() => <div>Login</div>} />
                    <Route path="/main" component={mainRender} />
                </>
            )
        })
    }
}