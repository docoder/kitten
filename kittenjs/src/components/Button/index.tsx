import React from 'react'
import { App, ActionMeta } from '../../app'
import { Pages } from '../../pages'
import { useGET } from '../../hooks/useGET'
import { usePOST } from '../../hooks/usePOST'
interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    meta: ActionMeta;
    buttonKey: string;
    forceUpdate: Function;
    history: any;
    match: any;
}

function _Button(props: IProps): JSX.Element {
    const app = React.useContext(App)
    const get = useGET()
    const post = usePOST()
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'Button', props.buttonKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'Button', props.buttonKey, props)
        }
    }, [])
    const { showModal } = Pages.useContainer()
    const Comp = app.ui? app.ui.Button : null
    if (props.meta.url && !props.meta.href && !props.meta.method) { // 兼容旧 API
        props.meta.href = props.meta.url
    }
    return (
        <Comp 
        {...props.meta}
        style={{
            ...props.style,
        }} 
        onClick={async () => {
            app.hooks.beforeButtonClick.call(app.config.appKey, props.pageKey, props.buttonKey)
            if (props.meta.modal && props.meta.modal.length > 0) {
                showModal(props.pageKey, props.meta.modal)
            }else if (props.meta.link) {
                const link = props.meta.link
                if(link === '<') {
                    props.history.goBack()
                }else if(link.startsWith('/')) {
                    props.history.push(link.substring(1))
                }else {
                    props.history.push(`${props.match.url}/${link}`) 
                }
                
            }else if (props.meta.url && props.meta.method) {
                let result: any = null
                const prm = props.meta.params
                if (!props.meta.method || props.meta.method.toUpperCase() === 'GET') {
                    result = await get (props.meta.url, (prm&& prm.get) ? prm.get : {}) || []
                    if (result) props.forceUpdate()
                }else if (props.meta.method.toUpperCase() === 'POST') {
                    result = await post(props.meta.url, (prm && prm.post) ? prm.post : {})
                    if (result) props.forceUpdate()
                    
                }
            }
            
        }} />
    );
};

export const Button = React.memo(_Button)