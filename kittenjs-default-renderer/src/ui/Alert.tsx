import React from 'react'
import ReactDOM from 'react-dom';
import {Alert} from 'ant-colony-ui';
import styled from 'styled-components';

const AppAlert = styled(Alert)`
    &.ant-alert-with-description {
        position: fixed;
        top: 64px;
        width: 100%;
    }
    &.ant-alert {
        position: fixed;
        top: 64px;
        width: calc(100% - 220px);
        margin-left: -10px;
        margin-top: 10px;
    }
    z-index: 150;
`;
export default function _Alert(dom: HTMLElement, props: {[propName: string]: any}) {
    // console.log('===ALERT-PROPS===:', props)
    ReactDOM.render(
        <AppAlert
            type={props.type}
            messge={props.messge}
            description={props.description}
            onClose={props.onClose}
        />,
        dom,
    );
}
