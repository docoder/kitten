import React from 'react'
import {Button as AntButton} from 'ant-colony-ui';

export function Button(props: {[propName: string]: any}) {
    let element = <AntButton
            title={props.label} 
            onClick={props.onClick}
        />
    if (props.url && props.url.length > 0) {
        element = <a href={props.url}>{element}</a>
    }
    return (
        <div style={props.style} className={props.className}>{element}</div>
    )
}
