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
    const { hideModal } = Pages.useContainer()
    const send = React.useCallback(
        async (values: {[x:string]: any}) => {
            let result = null
            if (method && method.toLowerCase() === 'post') {
                result = post(url, values)
            }else {
                result = get(url, values)
            }
            if (result && modalKey) {
                hideModal(pageKey, modalKey)
            }
        },
        []
    )
    return send
}