import React from 'react'
import { Tabs as AntTabs } from 'ant-colony-ui'

export function Tabs(props: {[propName: string]: any}) {
    // console.log('===TABS-PROPS===:', props)
    return (
        <AntTabs
            style={props.style}
            className={props.className}
            onChange={props.onChange}
            defaultActiveKey={props.defaultActiveKey}
        >
            {props.children}
        </AntTabs>
    )
}

Tabs.Panel = AntTabs.Panel
