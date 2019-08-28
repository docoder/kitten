import React from 'react'
import { App } from '../app'
import { Pages } from '../pages';
import { POST } from '../utils/http'

export function usePOST() {
    const app = React.useContext(App) 
    const { setError, startRequest, endRequest } = Pages.useContainer()
    const send = React.useCallback(
        async (url: string, body: Json) => {
            try {
                startRequest();
                const data = await POST(url, app.config.loginUrl, body)
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