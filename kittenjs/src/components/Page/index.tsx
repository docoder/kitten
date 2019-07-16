import React from 'react'
import { App } from '../../app'
import Indicator from '../Indicator'
interface IProps {
    style?: React.CSSProperties;
    children: React.ReactNode;
    pageKey: string;
}

export default function Page(props: IProps): JSX.Element {
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
            <Indicator /> 
        </k_page>
    );
};

