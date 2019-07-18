import React from 'react'
import ReactDOM from 'react-dom';
import {Button} from 'ant-colony-ui';

export default function _Button(dom: HTMLElement, props: {[propName: string]: any}) {
    // console.log('===BUTTON-PROPS===:', props)
    let element = <Button
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
