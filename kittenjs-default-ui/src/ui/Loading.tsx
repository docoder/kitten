import React from 'react'
import {Loading as AntLoading} from 'ant-colony-ui';

export function Loading(props: {[propName: string]: any}) {
    // console.log('===LOADING-PROPS===:', props)
    return (
        <AntLoading
            show={props.show}
            type={props.type}
            timeout={props.timeout}
        />
    )
}
