import React from 'react'
import { App, PageSection } from '../../app'
import { Stack } from '../Stack'
import { Pages } from '../../pages'
interface IProps {
    style?: React.CSSProperties
    title?: string
    width?: number
    contents: PageSection[] 
    pageKey: string
    modalKey: string
    forceUpdate: Function
    history: any;
}

function _Modal(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'Modal', props.modalKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'Modal', props.modalKey, props)
        }
    }, [])
    const { hideModal, isShowModal, getParams } = Pages.useContainer()
    const Comp = app.ui? app.ui.Modal : null
    let newTitle:any = props.title
    if (props.title) {
        if (props.title.startsWith('$.')){
            const params = getParams(props.pageKey, props.modalKey)
            if (params) {
                const valueKey = props.title.split('.')[1]
                newTitle = params[valueKey] 
            }
        }else {
            let reg = /{\$\.([^{}]*)}/g;
            if (reg.test(props.title)) {
                newTitle = props.title.replace(reg, function(match,p1){
                    let valueKey = p1.trim();
                    const params = getParams(props.pageKey, props.modalKey)
                    if (params) {
                        return params[valueKey]
                    }
                    return valueKey
                })
            }
        }
        
    }
    return (
        <Comp
            style={{display: 'none'}}
            visible={isShowModal(props.pageKey, props.modalKey)}
            title={newTitle}
            width={props.width}
            onCancel={() => {
                hideModal(props.pageKey, props.modalKey)
            }}
        >
            <Stack 
                pageKey={props.pageKey} 
                items={props.contents} 
                direction="vertical" 
                stackKey={`${props.pageKey}_${props.modalKey}_main_stack`} 
                history={props.history}
            />
        </Comp>
    );
};

export const Modal = _Modal