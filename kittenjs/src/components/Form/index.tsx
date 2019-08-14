import React from 'react'
import { App } from '../../app'
import { useSelect } from '../../hooks/useSelect'
import { useSubmit } from '../../hooks/useSubmit'
import { Pages } from '../../pages'

export type FormItem = {
    key: string, 
    filterAlias?: string,
    filterDisabled?: boolean,
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
}
function _Form (props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'form', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'form', props)
        }
    }, [])
    const items = useSelect(props.pageKey, props.formKey, props.items)
    const { setFilter } = Pages.useContainer()
    const submit = useSubmit(props.meta.url, props.meta.method, props.pageKey, props.meta.modal)
    return (
        <k_form
            style={{
                ...props.style,
            }} 
            inModal={props.meta.modal && props.meta.modal.length > 0}
            className={props.className}
            items={items}
            onSubmit={(values: {[key: string]: any}) => {
                app.hooks.beforeFormSubmit.call(app.config.appKey, props.pageKey, props.formKey)
                const keys = items.filter(i => !i.filterDisabled).map(i => i.key)
                let keyFilterAliasMap: any = {}
                items.filter(i => i.filterAlias).forEach(i => {
                   keyFilterAliasMap[i.key] = i.filterAlias 
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