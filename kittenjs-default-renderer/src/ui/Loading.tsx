import React from 'react'
import ReactDOM from 'react-dom';
import {Loading as AntLoading} from 'ant-colony-ui';

export function Loading(dom: HTMLElement, props: {[propName: string]: any}) {
    // console.log('===LOADING-PROPS===:', props)
    ReactDOM.render(
        <AntLoading
            show={props.show}
            type={props.type}
            timeout={props.timeout}
        />,
        dom,
    );
}
