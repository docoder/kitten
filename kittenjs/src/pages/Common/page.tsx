import React from 'react'
import { App } from '../../app'
import {Page, Table, Form} from '../../components'
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
                    {state.data.map((c: any, i: number) => {
                        switch (c.type) {
                            case 'Table':
                                return (
                                    <Table
                                        pageKey={pageKey}
                                        tableKey={c.key}
                                        style={{marginBottom: 20}}
                                        key={i}
                                        columns={c.items}
                                        meta={{
                                            url:c.meta.url,
                                            method: c.meta.method,
                                            data: c.meta.data
                                        }}
                                    />
                                );
                            case 'Form':
                                return (
                                    <Form
                                        pageKey={pageKey}
                                        formKey={c.key}
                                        style={{marginBottom: 20}}
                                        key={i}
                                        items={c.items}
                                        meta={{
                                            url: c.meta.url,
                                            method: c.meta.method,
                                            filter: c.meta.filter
                                        }} 
                                    />
                                )
                            default:
                                return null
                        }
                    })}
                </Page>
    );
};