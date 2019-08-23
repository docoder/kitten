import React from 'react'
import { App } from '../../app'
import { useSelect } from '../../hooks/useSelect'
import { useSubmit } from '../../hooks/useSubmit'
import { Pages } from '../../pages'

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
    }
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
        params?: {[x:string]: any};
    };
    pageKey: string; 
    formKey: string;
    forceUpdate: Function;
}
function _Form (props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'form', props.formKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'form', props.formKey, props)
        }
    }, [])
    const { getParams, setFilter } = Pages.useContainer()
    const items = useSelect(props.pageKey, props.formKey, props.items)
    items.forEach((i:any) => {
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
            items={items}
            columnsCount={props.meta.columnsCount}
            rowColCounts={props.meta.rowColCounts}
            onSubmit={(values: {[key: string]: any}) => {
                app.hooks.beforeFormSubmit.call(app.config.appKey, props.pageKey, props.formKey)
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
                
                if(props.meta.filter) {
                    setFilter(props.pageKey, props.meta.filter, newValues) 
                }else {
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
                    submit(newValues)
                }
            }}
        />
    );
};
export const Form = React.memo(_Form)