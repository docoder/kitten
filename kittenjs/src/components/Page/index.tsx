import React from 'react'
import { App } from '../../app'
interface IProps {
    style?: React.CSSProperties;
    children: React.ReactNode;
    pageKey: string;
}

function _Page(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'page', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'page', props)
        }
    }, [])
    const Comp = app.ui? app.ui.Page : null
    return (
        <Comp
            style={{
                ...props.style,
            }}>
            {props.children}
        </Comp>
    );
};

export const Page = React.memo(_Page)