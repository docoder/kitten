import React from 'react'
import { Modal as AntModal } from 'ant-colony-ui'

export function Modal(props: {[propName: string]: any}) {
    // console.log('===MODAL-PROPS===:', props)
    return (
        <AntModal
            style={props.style}
            className={props.className}
            visible={props.visible}
            title={props.title}
            onCancel={props.onCancel}
            width={props.width}
            footer={null}
            destroyOnClose={true}
        >
            {props.children}
        </AntModal>
    )
}