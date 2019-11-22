import React from 'react'
import { App, PageSection, PageSectionItem } from '../../app'
import { Stack } from '../Stack'
import { useGET } from '../../hooks/useGET'
import { usePOST } from '../../hooks/usePOST'
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
    if (props.items && props.items.length > 0 ) {
        if (props.items[0].type && props.items[0].type.length > 0) {
            hasChild = true
        }else {
            props.items.map( (i: any) => {
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
                    i.onClick = async () => {
                        let result: any = null
                        const prm = i.meta.params
                        if (!i.meta.method || i.meta.method.toUpperCase() === 'GET') {
                            result = await get (i.meta.url, (prm&& prm.get) ? prm.get : {}) || []
                            if (result) props.forceUpdate()
                        }else if (i.meta.method.toUpperCase() === 'POST') {
                            result = await post(i.meta.url, (prm && prm.post) ? prm.post : {})
                            if (result) props.forceUpdate()
                        }
                    }
                }
            })
        }
    }
    return (
        <Comp
            items={hasChild ? [] : props.items}
            title={props.meta.label}
            width={props.meta.width}
            columnsCount={props.meta.columnsCount}
            headerColor={props.meta.headerColor}
            headerBgColor={props.meta.headerBgColor}
        >
            {hasChild ? 
                <Stack 
                    pageKey={props.pageKey} 
                    items={(props.items as PageSection[])} 
                    direction={props.meta.direction ? props.meta.direction: 'vertical'} 
                    stackKey={`${props.pageKey}_${props.panelKey}_main_stack`} 
                    history={props.history}
                    match={props.match} 
                /> : null}
        </Comp>
    )
}

export const Panel = _Panel