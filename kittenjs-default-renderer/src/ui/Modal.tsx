import React from 'react'
import { Modal } from 'ant-colony-ui'
import ReactCommon from '../index';

export default function _Modal(dom: HTMLElement, props: {[propName: string]: any}) {
    console.log('===MODAL-PROPS===:', props)
    ReactCommon.render(
        <Modal
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
        </Modal>,
        dom,
        ()=>{}
    );
}