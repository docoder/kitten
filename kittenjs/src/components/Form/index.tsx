import React from 'react'
import { App } from '../../app'
import { useSelect } from '../../hooks/useSelect'
import { useSubmit } from '../../hooks/useSubmit'
import { Pages } from '../../pages'
import { Stack } from '../Stack'

export type FormItem = {
    key: string, 
    alias?: string,
    actionDisabled?: boolean,
    label: string, 
    type?: string,
    meta?: {
        url: string,
        method: string,
        data?: {value: string, label: string}[]
    },
    value?: string
}
interface IProps {
    style?: React.CSSProperties;
    className?: string;
    items: (FormItem[]);
    meta: {
        url: string;
        method: string;
        filter?: string;
        modal?: string;
        columnsCount: number;
        rowColCounts: number[];
        disableGroupCol: boolean;
        params?: {[x:string]: any};
        accessories: any[];
        componentKey?: string;
    };
    pageKey: string; 
    formKey: string;
    forceUpdate: Function;
    history: any;
}
function _Form (props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'form', props.formKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'form', props.formKey, props)
        }
    }, [])
    const { getParams, setFilter, setParams, hideModal } = Pages.useContainer()
    const items = useSelect(props.pageKey, props.formKey, props.items)
    const newItems = items.map( i => ({...i}))
    newItems.forEach((i:any) => {
        if (i.value && (typeof i.value === 'string') && i.value.startsWith('$.') && props.meta.modal) {
            const params = getParams(props.pageKey, props.meta.modal)
            if (params) {
                const valueKey = i.value.split('.')[1]
                i.value = params[valueKey] || []
            } 
        }
        if (i.meta && typeof i.meta.data === 'string' && i.meta.data.startsWith('$.')) {
            if (props.meta.modal) {
                const params = getParams(props.pageKey, props.meta.modal)
                if (params) {
                    const valueKey = i.meta.data.split('.')[1]
                    i.meta.data = params[valueKey] || []
                }else {
                    i.meta.data = []
                }
            }
        }
        app.hooks.beforeFormItemsFinalization.call(app.config.appKey, props.pageKey, props.formKey, items)
    });
    
    const submit = useSubmit(props.meta.url, props.meta.method, props.pageKey, props.meta.modal)
    const Comp = app.ui? app.ui.Form : null
    return (
        <Comp
            style={{
                ...props.style,
            }} 
            inModal={props.meta.modal && props.meta.modal.length > 0}
            className={props.className}
            items={newItems}
            columnsCount={props.meta.columnsCount}
            rowColCounts={props.meta.rowColCounts}
            disableGroupCol={props.meta.disableGroupCol}
            accessories={props.meta.accessories ? <Stack 
                pageKey={props.pageKey} 
                items={props.meta.accessories} 
                direction="vertical" 
                stackKey={`${props.pageKey}_${props.formKey}_accessories_stack`} 
                history={props.history}
            /> : undefined}
            onSubmit={(values: {[key: string]: any}) => {
                const keys = items.filter(i => !i.actionDisabled).map(i => i.key)
                let keyAliasMap: any = {}
                items.filter(i => i.alias).forEach(i => {
                    keyAliasMap[i.key] = i.alias 
                });
                let newValues: {[x:string]: any} = {}
                Object.keys(values).forEach((k: string) => {
                    if (values[k] && keys.includes(k)) {
                        const vk = keyAliasMap[k] || k
                        newValues[vk] = values[k]
                    }
                });
                const extraValues = getParams(props.pageKey, props.formKey)
                newValues = { ...newValues, ...extraValues }
                if (props.meta.params && props.meta.params.post) {
                    const post = props.meta.params.post
                    const keys = Object.keys(post)
                    if (keys && keys.length > 0) {
                        keys.forEach((k:string) => {
                            const value = post[k]
                            if (value.startsWith('$.') && props.meta.modal) {
                                const modalParams = getParams(props.pageKey, props.meta.modal)
                                if (post) {
                                    const valueKey = value.split('.')[1]
                                    newValues[k] = modalParams[valueKey] 
                                }
                            }else {
                                newValues[k] = value
                            }
                        });
                    }
                }
                app.hooks.beforeFormSubmit.call(app.config.appKey, props.pageKey, props.formKey, newValues)
                if(props.meta.componentKey) {
                    setParams(props.pageKey, props.meta.componentKey, newValues)
                    if (props.meta.modal) {
                        hideModal(props.pageKey, props.meta.modal)
                    }
                }
                else if(props.meta.filter) {
                    setFilter(props.pageKey, props.meta.filter, newValues) 
                    if (props.meta.modal) {
                        hideModal(props.pageKey, props.meta.modal)
                    }
                }else {
                    submit(newValues)
                }
            }}
        />
    );
};
export const Form = React.memo(_Form)