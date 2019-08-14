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
    return (
        <k_page
            style={{
                ...props.style,
            }}>
            {props.children} 
        </k_page>
    );
};

export const Page = React.memo(_Page)