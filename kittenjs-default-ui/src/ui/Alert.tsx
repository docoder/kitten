import React from 'react'
import {Alert as AntAlert} from 'ant-colony-ui';
import styled from 'styled-components';

const AppAlert = styled(AntAlert)`
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
export function Alert( props: {[propName: string]: any}) {
    // console.log('===ALERT-PROPS===:', props)
    return (
        <AppAlert
            style={props.style}
            className={props.className}
            type={props.type}
            messge={props.messge}
            description={props.description}
            onClose={props.onClose}
        />
    )
}
