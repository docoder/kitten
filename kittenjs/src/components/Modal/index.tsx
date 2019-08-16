import React from 'react'
import { App, PageSection } from '../../app'
import { Stack } from '../Stack'
import { Pages } from '../../pages'
interface IProps {
    style?: React.CSSProperties
    title?: string
    width?: number
    contens: PageSection[] 
    pageKey: string
    modalKey: string
}

function _Modal(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'modal', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'modal', props)
        }
    }, [])
    const { hideModal, isShowModal } = Pages.useContainer()
    const Comp = app.ui? app.ui.Modal : null
    return (
        <Comp
            style={{display: 'none'}}
            visible={isShowModal(props.pageKey, props.modalKey)}
            title={props.title}
            width={props.width}
            onCancel={() => {
                hideModal(props.pageKey, props.modalKey)
            }}
        >
            <Stack 
                pageKey={props.pageKey} 
                items={props.contens} 
                direction="vertical" 
                stackKey={`${props.pageKey}_${props.modalKey}_main_stack`} 
            />
        </Comp>
    );
};

export const Modal = React.memo(_Modal)