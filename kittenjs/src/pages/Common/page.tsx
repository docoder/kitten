import React from 'react'
import { App } from '../../app'
import {Page, Stack} from '../../components'
import useGET from '../../hooks/useGET'

export default function PageContainer(props: {pageKey: string, pageAPI?: string, pageJSON?: any[]}):JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterPageLoaded.call(app.config.appKey, pageKey, props)
        return () => {
            app.hooks.afterPageUnloaded.call(app.config.appKey, pageKey, props)
        }
    }, [])
    const {send} = useGET()
    const type = "PAGE_JSON_FETCHED";
    const [state, dispatch] = React.useReducer(
		(state, action) => {
			switch (action.type) {
				case type:
					return { ...state, data: action.data };
				default:
					throw new Error();
			}
		},
		{ data: [] }
	);
    
    React.useEffect(() => {
        async function fetchPageJson(url: string) {
            const data = await send(url)
            dispatch({type, data})
        }
        if (props.pageJSON && props.pageJSON.length > 0) {
            dispatch({type, data: props.pageJSON})
        }else if (props.pageAPI) {
            fetchPageJson(`${props.pageAPI}?page=${props.pageKey}`)
        }
    }, [])
    const { pageKey } = props
    return (
        <Page pageKey={pageKey} style={{padding: 20, background: 'white'}}>
            <Stack 
                pageKey={pageKey} 
                items={state.data} 
                direction="vertical" 
                stackKey={`${pageKey}_main_stack`} 
            />
        </Page>
    );
};