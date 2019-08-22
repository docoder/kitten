import React from 'react'
export function useParams() {
    const [_params, _setParams] = React.useState<{[x: string]: {[x:string]: any}}>({})
    const getParams = (pageKey: string, sectionKey: string) => {
        const f = _params[`${pageKey}_${sectionKey}`]
        return f;
    }
    const setParams = (pageKey: string, sectionKey: string, value: {[x:string]: any}) => {
        _setParams({
            ..._params,
            [`${pageKey}_${sectionKey}`]: value
        })
    }
    return { getParams, setParams }
}