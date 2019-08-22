import React from 'react'
export function Page(props: {[propName: string]: any}) {
    // console.log('===PAGE-PROPS===:', props)
    return (
        <div {...props} />
    )
}