import React from 'react'
import {Checkbox as AntCheckbox} from 'ant-colony-ui';

export function Checkbox(props: {[propName: string]: any}) {
    // console.log('===CHECKBOX-PROPS===:', props)
    return (
        <span style={props.style} className={props.className}>
            <AntCheckbox
                onChange={props.onChange}
                disabled={props.disabled}
                defaultChecked={props.defaultChecked}
            >
                {props.title}
            </AntCheckbox>
        </span>
    ) 
}