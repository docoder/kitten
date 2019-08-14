import React from 'react'
import { Modal as AntModal } from 'ant-colony-ui'
import { Renderer as ReactCommon } from '../index';

export function Modal(dom: HTMLElement, props: {[propName: string]: any}) {
    // console.log('===MODAL-PROPS===:', props)
    ReactCommon.render(
        <AntModal
            visible={props.visible}
            title={
                <div style={{
                    fontWeight: 500, 
                    fontSize: '14px', 
                    lineHeight: '22px', 
                    wordWrap: 'break-word',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <div>{props.title}</div>
                    <div style={{color: 'gray', fontSize: 20}}>×</div>
                </div>
            }
            onCancel={props.onCancel}
            width={props.width}
            mask={props.visible}
            footer={null}
        >
          {props.children}
        </AntModal>,
        dom,
        ()=>{}
    );
}