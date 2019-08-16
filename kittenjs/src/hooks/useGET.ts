import React from 'react'
import { App } from '../app'
import { Pages } from '../pages';
import { GET } from '../utils/http'

export function useGET() {
    const app = React.useContext(App) 
    const { setError, startRequest, endRequest } = Pages.useContainer()
    const send = React.useCallback(
        async (url: string, filter?: {[x:string]: any}) => {
            try {
                startRequest();
                let u = url;
                if (filter && Object.keys(filter).length > 0) {
                    let paramsStr = '?';
                    Object.keys(filter).forEach(k => {
                        paramsStr += `${k}=${filter[k]}&`
                    })
                    u = `${url}${paramsStr.slice(0, -1)}`
                }
                const data = await GET(u, app.config.loginUrl)
                endRequest();
                //TODO: DOC
                if (data.code === 0 && data.data) {
                    return data
                }else {
                    setError(data)
                }
            }catch (error) {
               setError(error);
            }
            return null
        },
        []
    )
    return send
}