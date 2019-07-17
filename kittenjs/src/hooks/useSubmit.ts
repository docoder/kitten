import React, { unstable_Profiler } from 'react'
import useGET from './useGET';
import usePOST from './usePOST';
import Pages from '../pages'

export default function useSubmit(
    url: string,
    method: string,
    pageKey: string,
    modalKey?: string
) {
    const get = useGET()
    const post = usePOST()
    const { hideModal } = Pages.useContainer()
    function send(values: {[x:string]: any}) {
        let result = null
        if (method && method.toLowerCase() === 'post') {
            result = post.send(url, values)
        }else {
            result = get.send(url, values)
        }
        if (result && modalKey) {
            hideModal(pageKey, modalKey)
        }
    }
    return { send }
}