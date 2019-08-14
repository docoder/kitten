import React from 'react';
import { useGET } from './useGET'
import {App} from '../app';
import {FormItem} from '../components/Form';
import { getValueByKeypath } from '../utils/modal'
export function useSelect(
    pageKey: string,
    formKey: string,
    items: any[]
): FormItem[] {
    const app = React.useContext(App)
    const get = useGET()
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
        let mounted = true;
        async function fetchSelectData( p: string, f: string, k: string, u: string, a: {[x:string]: string}) {
            app.hooks.beforeFormSelectFetched.call(
                app.config.appKey,
                p,
                f,
                items,
                k,
            );
            const result = await get (u) || []
            app.hooks.afterFormSelectFetched.call(
                app.config.appKey,
                p,
                f,
                items,
                k,
                result.data,
            );
            //TODO: doc
            let data = result.data
            if (a) {
                data = data.map((d: any) => ({
                    label: getValueByKeypath(d, a.label || 'label'),
                    value: getValueByKeypath(d, a.value || 'value')
                }))
            }
            return data
        }
        async function handleSelect(pp: string, ff: string, itms: any[]) {
            const hasSelect = itms.find(i => i.type === 'select')
            if (!hasSelect) return // 阻止无 select 的 items 造成一次重复渲染
            await Promise.all(
                itms.filter(i => i.type === 'select')
                    .map(async i => {
                        if (i.meta && i.meta.data) {
                            return i
                        }else if (i.meta && i.meta.ref) {
                            if (i.meta.refData) {
                                i.meta.data = (refValue: string) => {
                                    return i.meta.refData[refValue]
                                }
                                return i
                            }else if (i.meta.url) {
                                const cachedSelectedData: {[x:string]: any} = {} // 缓存已经请求的结果，不用再次请求
                                i.meta.data = (refValue: string) => {
                                    const originalUrl = i.meta.url
                                    async function fetchRefData(rfv: string) {
                                        const url = originalUrl.replace('$refValue', rfv)
                                        const selectData = await fetchSelectData(
                                            pp,
                                            ff,
                                            i.key,
                                            url,
                                            i.meta.alias
                                        ); 
                                        cachedSelectedData[rfv] = selectData
                                        i.meta.data = ((rv:string) => { 
                                            return (r: string) => {
                                                if (r === rv) return selectData
                                                else if (cachedSelectedData[r]) return cachedSelectedData[r]
                                                else {
                                                    fetchRefData(r)
                                                    return []
                                                }
                                            }
                                        })(rfv)
                                        if(mounted) dispatch({type, data: itms})
                                    }
                                    fetchRefData(refValue)
                                    return []
                                }
                            }
                        }else if (i.meta && i.meta.url) {
                            i.meta.data = await fetchSelectData(
                                pp,
                                ff,
                                i.key,
                                i.meta.url,
                                i.meta.alias
                            );
                            return i
                        }else {
                            throw new Error('The JSON format is not valid!')
                        }
                    }),
            );
            if(mounted) dispatch({type, data: itms})
        }
        handleSelect(pageKey, formKey, items)
        const cleanup = () => { mounted = false; };
        return cleanup;
    }, [pageKey, formKey, items])
    return state.data
}
