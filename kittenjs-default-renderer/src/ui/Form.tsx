import React from 'react'
import ReactDOM from 'react-dom';
import {Form} from 'ant-colony-ui';
import styled from 'styled-components';
const ModalForm = styled(Form)`
    & .ant-form {
        background: white;
        border: 0px;
        border-radius: 0px;
        padding: 0px;
    }
    & .ant-row {
        padding: 0px;
    }
`;
export default function _Form(dom: HTMLElement, props: {[propName: string]: any}) {
    // console.log('===FORM-PROPS===:', props)
    const RealForm = props.inModal ? ModalForm : Form
    ReactDOM.render(
        <RealForm
            forms={props.items}
            onSubmit={props.onSubmit}
            actionDirection="right"
            columnCount={props.inModal ? 1 : 4}
        />,
        dom,
    );
}
