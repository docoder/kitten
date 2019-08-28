import React, { unstable_Profiler } from 'react'
import { useGET } from './useGET';
import { usePOST } from './usePOST';
import { Pages } from '../pages'

export function useSubmit(
    url: string,
    method: string,
    pageKey: string,
    modalKey?: string
) {
    const get = useGET()
    const post = usePOST()
    const { hideModal, getParams } = Pages.useContainer()
    const send = React.useCallback(
        async (values: {[x:string]: any}) => {
            let result = null
            if (method && method.toLowerCase() === 'post') {
                result = await post(url, values)
                if (modalKey) {
                    const params = getParams(pageKey, modalKey)
                    if (params && params.forceReload ) {
                        params.forceReload()
                    }
                    else window.location.reload(true)
                } 
            }else {
                result = await get(url, values)
            }
            if (result && modalKey) {
                hideModal(pageKey, modalKey)
            }
        },
        []
    )
    return send
}