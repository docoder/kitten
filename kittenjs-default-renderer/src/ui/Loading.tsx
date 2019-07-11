import React from 'react'
import ReactDOM from 'react-dom';
import {Loading} from 'ant-colony-ui';

export default function _Loading(dom: HTMLElement, props: {[propName: string]: any}) {
    // console.log('===LOADING-PROPS===:', props)
    ReactDOM.render(
        <Loading
            show={props.show}
            type={props.type}
            timeout={props.timeout}
        />,
        dom,
    );
}
