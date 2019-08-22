import React from 'react'
import { App } from '../../app'
import { useSelect } from '../../hooks/useSelect'
import { useSubmit } from '../../hooks/useSubmit'
import { Pages } from '../../pages'

export type FormItem = {
    key: string, 
    alias?: string,
    disabled?: boolean,
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
    };
    pageKey: string; 
    formKey: string;
    columnsCount: number
}
function _Form (props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'form', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'form', props)
        }
    }, [])
    const { getParams, setFilter } = Pages.useContainer()
    const items = useSelect(props.pageKey, props.formKey, props.items)
    items.forEach((i:any) => {
        if (typeof i.data === 'string' && i.data.startsWith('$.')) {
            if (props.meta.modal) {
                const params = getParams(props.pageKey, props.meta.modal)
                if (params) {
                    const valueKey = i.data.split('.')[1]
                    i.data = params[valueKey] || []
                }else {
                    i.data = []
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
            columnsCount={props.columnsCount}
            onSubmit={(values: {[key: string]: any}) => {
                app.hooks.beforeFormSubmit.call(app.config.appKey, props.pageKey, props.formKey)
                const keys = items.filter(i => !i.disabled).map(i => i.key)
                let keyFilterAliasMap: any = {}
                items.filter(i => i.alias).forEach(i => {
                    keyFilterAliasMap[i.key] = i.alias 
                });
                let newValues: {[x:string]: any} = {}
                Object.keys(values).forEach((k: string) => {
                    if (values[k] && keys.includes(k)) {
                        const vk = keyFilterAliasMap[k] || k
                        newValues[vk] = values[k]
                    }
                });
                if(props.meta.filter) {
                    setFilter(props.pageKey, props.meta.filter, newValues) 
                }else {
                    submit(newValues)
                }
            }}
        />
    );
};
export const Form = React.memo(_Form)