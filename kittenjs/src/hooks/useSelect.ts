import React from 'react';
import { useGET } from './useGET'
import {App} from '../app';
import {FormItem} from '../components/Form';
import { getValueByKeypath } from '../utils/modal'
export function useSelect(
    pageKey: string,
    componentKey: string,
    items: any[]
): FormItem[] {
    const app = React.useContext(App)
    const get = useGET()
    const type = `${pageKey.toUpperCase()}_${componentKey.toUpperCase()}_SELECT_DATA_FETCHED`
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
        async function fetchSelectData (itemKey: string, itemUrl: string, itemAlias: {[x:string]: string}) {
            app.hooks.beforeFormSelectFetched.call(app.config.appKey, pageKey, componentKey, items, itemKey);
            const result = await get (itemUrl) || []
            app.hooks.afterFormSelectFetched.call( app.config.appKey, pageKey, componentKey, items, itemKey, result.data);
            //TODO: doc
            let data = result.data
            if (itemAlias) {
                data = data.map((d: any) => ({
                    label: getValueByKeypath(d, itemAlias.label || 'label'),
                    value: getValueByKeypath(d, itemAlias.value || 'value')
                }))
            }
            return data
        }
        async function handleSelect(itms: any[]) {
            const selectItems = itms.filter(i => i.type === 'select')
            if (selectItems.length <= 0) return // 阻止无 select 的 items 造成一次重复渲染
            await Promise.all(selectItems.map(async i => {
                i.meta.showSearch = true
                if (i.meta && i.meta.data) {
                    return i
                }else if (i.meta && i.meta.ref) {
                    if (i.meta.refData) {
                        i.meta.data = (refValue: string) => i.meta.refData[refValue]
                        return i
                    }else if (i.meta.url) {
                        const originalUrl = i.meta.url
                        const refItem = itms.find(it => it.key === i.meta.ref)
                        refItem.onChange = async (value: any) => {
                            const url = originalUrl.replace('$refValue', value)
                            const selectData = await fetchSelectData(i.key, url, i.meta.alias);
                            i.meta.data = selectData
                            if(mounted) dispatch({type, data: itms})
                        }
                        i.meta.data = []
                        return i
                    }
                }else if (i.meta && i.meta.url) {
                    i.meta.data = await fetchSelectData(i.key, i.meta.url, i.meta.alias);
                    return i
                }else {
                    throw new Error('The JSON format is not valid!')
                }
            }));
            if(mounted) dispatch({type, data: itms})
        }
        handleSelect(items)
        return () => { mounted = false };
    }, [pageKey, componentKey, items])
    return state.data
}
