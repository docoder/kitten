import React from 'react'
import ReactDOM from 'react-dom';
import {Form} from 'ant-colony-ui';


export default function _Form(dom: HTMLElement, props: {[propName: string]: any}) {
    // console.log('===FORM-PROPS===:', props)
    ReactDOM.render(
        <Form
            forms={props.items}
            onSubmit={props.onSubmit}
            actionDirection="right"
        />,
        dom,
    );
}
