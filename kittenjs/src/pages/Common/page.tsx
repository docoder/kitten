import React from 'react'
import { App } from '../../app'
import {Page as PageComp, Stack, Indicator} from '../../components'
import { useGET } from '../../hooks/useGET'

function PageContainer(props: {pageKey: string, pageAPI?: string, pageJSON?: any[], history: any}):JSX.Element {
    // console.log('>>>>PAGE>>>>', props)
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterPageLoaded.call(app.config.appKey, pageKey, props)
        return () => {
            app.hooks.afterPageUnloaded.call(app.config.appKey, pageKey, props)
        }
    }, [])
    const get = useGET()
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
		{ data: props.pageJSON || [] }
	);
    
    React.useEffect(() => {
        async function fetchPageJson(url: string) {
            const result = await get(url)
            if (result && result.data && Array.isArray(result.data.pageJSON) ) {
                dispatch({type, data: result.data.pageJSON})
            }else {
                dispatch({type, data: []})
            }
            
        }
        if ((!props.pageJSON || !Array.isArray(props.pageJSON)) && props.pageAPI) {
            
            fetchPageJson(`${props.pageAPI}?pageKey=${props.pageKey}`)
        }
    }, [])
    const { pageKey } = props
    return React.useMemo(() => (
        <PageComp pageKey={pageKey} style={{padding: 20, background: 'white'}}>
            <Stack 
                pageKey={pageKey} 
                items={state.data} 
                direction="vertical" 
                stackKey={`${pageKey}_main_stack`} 
                history={props.history}
            />
            <Indicator />
        </PageComp>
    ), [pageKey, state]);
};
export const Page = PageContainer