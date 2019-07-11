import React from 'react';
import useGET from './useGET'
import {App} from '../app';
import {FormItem} from '../components/Form';
export default function useSelect(
    pageKey: string,
    formKey: string,
    items: any[]
): FormItem[] {
    const app = React.useContext(App)
    const { send } = useGET()
    const type = 'SELECT_DATA_FETCHED'
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case type:
                    return {...state, data: action.data}
                default:
                    throw new Error()
            }
        },
        {data: items},
    )
    React.useEffect(() => {
        async function fetchSelectData( p: string, f: string, k: string, u: string) {
            app.hooks.beforeFormSelectFetched.call(
                app.config.appKey,
                p,
                f,
                items,
                k,
            );
            const data = await send (u) || []
            app.hooks.afterFormSelectFetched.call(
                app.config.appKey,
                p,
                f,
                items,
                k,
                data,
            );
            return data
        }
        async function handleSelect(pp: string, ff: string, itms: any[]) {
            await Promise.all(
                itms.filter(i => i.type === 'select')
                    .map(async i => {
                        if (i.meta && i.meta.data) {
                            return i
                        }else if (i.meta && i.meta.url) {
                            i.meta.data = await fetchSelectData(
                                pp,
                                ff,
                                i.key,
                                i.meta.url,
                            );
                            return i
                        }else {
                            throw new Error('The JSON format is not valid!')
                        }
                    }),
            );
            dispatch({type, data: itms})
        }
        handleSelect(pageKey, formKey, items)
    }, [pageKey, formKey, items])
    return state.data
}
