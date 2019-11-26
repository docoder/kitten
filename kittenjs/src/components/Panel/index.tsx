import React from 'react'
import { App, PageSection, PageSectionItem } from '../../app'
import { Stack } from '../Stack'
import { useGET } from '../../hooks/useGET'
import { usePOST } from '../../hooks/usePOST'
import { getValueByKeypath } from '../../utils/modal'
interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    meta: {[x:string]: any};
    items: (PageSection | PageSectionItem)[]
    panelKey: string;
    forceUpdate: Function;
    history: any;
    match: any;
}

function _Panel (props: IProps): JSX.Element {
    const app = React.useContext(App)
    const panelItems = React.useRef<(PageSection | PageSectionItem)[]>(JSON.parse(JSON.stringify(props.items)));
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'Panel', props.panelKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'Panel', props.panelKey, props)
        }
    }, [])
    const get = useGET()
    const post = usePOST()
    const Comp = app.ui? app.ui.Panel : null
    let hasChild = false
    // const panelItems =JSON.parse(JSON.stringify(props.items))
    if (panelItems && panelItems.current.length > 0 ) {
        if (panelItems.current[0].type && panelItems.current[0].type.length > 0) {
            hasChild = true
        }else {
            const req = async (meta: any) => {
                let result: any = null
                const prm = meta.params
                if (!meta.method || meta.method.toUpperCase() === 'GET') {
                    result = await get (meta.url, (prm&& prm.get) ? prm.get : {}) || []
                    return result
                }else if (meta.method.toUpperCase() === 'POST') {
                    result = await post(meta.url, (prm && prm.post) ? prm.post : {})
                    return result
                }
            }
            const handleItems = (panelData?: any) =>  {
                panelItems.current.forEach( (i: any) => {
                    if (i.meta && i.meta.link) {
                        i.onClick = () => {
                            const link = i.meta.link
                            if(link === '<') {
                                props.history.goBack()
                            }else if(link.startsWith('/')) {
                                props.history.push(link.substring(1))
                            }else {
                                props.history.push(`${props.match.url}/${link}`) 
                            }
                        }
                    }else if (i.meta && i.meta.url && i.meta.method) {
                        if (i.value && typeof i.value === 'string' && i.value.startsWith('$#') && !i.__fetched) {
                            i.__fetched = true
                            req(i.meta).then(result => {
                                if (result && result.data) {
                                    i.value = getValueByKeypath(result.data, i.value.split('$#')[1])
                                    props.forceUpdate()
                                }
                            })
                        }else if (!i.__fetched) {
                            i.onClick = async () => {
                                const result = await req(i.meta)
                                if (result) props.forceUpdate()
                            }
                        }
                    }
                    if (i.value && typeof i.value === 'string' && i.value.startsWith('$.') && panelData) {
                        i.value = getValueByKeypath(panelData, i.value.split('$.')[1])
                        props.forceUpdate()
                    }
                })
            }
            if (props.meta && props.meta.url && props.meta.method && !props.meta.__fetched) {
                props.meta.__fetched = true
                req(props.meta).then(result => {
                    if (result) {
                        handleItems(result.data)
                    }
                })
            }else {
                handleItems()
            }
            
        }
    }
    return (
        <Comp
            items={hasChild ? [] : panelItems.current}
            title={props.meta.label}
            width={props.meta.width}
            columnsCount={props.meta.columnsCount}
            headerColor={props.meta.headerColor}
            headerBgColor={props.meta.headerBgColor}
        >
            {hasChild ? 
                <Stack 
                    pageKey={props.pageKey} 
                    items={(panelItems.current as PageSection[])} 
                    direction={props.meta.direction ? props.meta.direction: 'vertical'} 
                    stackKey={`${props.pageKey}_${props.panelKey}_main_stack`} 
                    history={props.history}
                    match={props.match} 
                /> : null}
        </Comp>
    )
}

export const Panel = _Panel