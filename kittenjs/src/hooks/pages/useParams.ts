import React from 'react'
export function useParams() {
    const [_params, _setParams] = React.useState<{[x: string]: {[x:string]: any}}>({})
    //使用 useRef
    const countRef = React.useRef<{[x: string]: {[x:string]: any}}>();
    countRef.current = _params;
    const getParams = (pageKey: string, sectionKey: string) => {
        const params = countRef.current || {}
        const f = params[`${pageKey}_${sectionKey}`]
        return f;
    }
    const setParams = (pageKey: string, sectionKey: string, value: {[x:string]: any}) => {
        const params = countRef.current || {}
        _setParams({
            ...params,
            [`${pageKey}_${sectionKey}`]: value
        })
        
    }
    return { getParams, setParams }
}