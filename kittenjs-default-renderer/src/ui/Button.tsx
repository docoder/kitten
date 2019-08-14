import React from 'react'
import ReactDOM from 'react-dom';
import {Button as AntButton} from 'ant-colony-ui';

export function Button(dom: HTMLElement, props: {[propName: string]: any}) {
    console.log('===BUTTON-PROPS===:', props)
    let element = <AntButton
            title={props.label} 
            onClick={props.onClick}
        />
    if (props.url && props.url.length > 0) {
        element = <a href={props.url}>{element}</a>
    }
    ReactDOM.render(
        element
        ,
        dom,
    );
}
