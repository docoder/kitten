import React from 'react'
import { App } from '../app'
import Pages from '../pages';
import { POST } from '../utils/http'

export default function usePOST() {
    const app = React.useContext(App) 
    const { setError, startRequest, endRequest } = Pages.useContainer()
    async function send(url: string, body: Json) {
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
    }
    return { send }
}