import React from 'react'
import {Button as AntButton} from 'ant-colony-ui';

export function Button(props: {[propName: string]: any}) {
    // console.log('===BUTTON-PROPS===:', props)
    let element = <AntButton
            title={props.label} 
            onClick={props.onClick}
        />
    if (props.href&& props.href.length > 0) {
        element = <a href={props.href}>{element}</a>
    }
    return (
        <div style={props.style} className={props.className}>{element}</div>
    )
}
