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
        labelPosition?: string;
        disableGroupCol: boolean;
        actionsShow: boolean;
        params?: {[x:string]: any};
        accessories: any[];
        componentKey?: string;
        submitTitle?: string
        clearTitle?: string
        actionDirection?: string
        clearButtonShow?: boolean
    };
    pageKey: string; 
    formKey: string;
    forceUpdate: Function;
    history: any;
    match: any;
}
function get_url_parm_list(str: string){
    let params = str.substr(str.indexOf('?')+1);
    const param_list=[];
    while(params.indexOf('=')!=-1){
        const ind=params.indexOf('=');
        const k=params.substr(0,ind);
        const sp=params.indexOf('&');
        let v;
        if(sp==-1){
            v=params.substr(ind+1);
            params='';
        }else{
            v=params.substr(ind+1,sp-(ind+1));
            params=params.substr(sp+1);
        }
        const obj={
            key:k,
            val:v
        }
        param_list.push(obj);
    }
    return param_list;
}

// let formItems: FormItem[] = []
function _Form (props: IProps): JSX.Element {
    const app = React.useContext(App)
    const items = React.useRef<FormItem[]>(JSON.parse(JSON.stringify(props.items)));
    React.useEffect(() => {
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'Form', props.formKey, props)
        return () => {
            items.current = []
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'Form', props.formKey, props)
        }
    }, [])
    const { getParams, setFilter, setParams, hideModal } = Pages.useContainer() 
    
    items.current.forEach((i:any) => {
        if (i.__done) {
            return
        }
        if (i.value && (typeof i.value === 'string') && i.value.startsWith('$.') && props.meta.modal) {
            const params = getParams(props.pageKey, props.meta.modal)
            if (params) {
                const valueKey = i.value.split('.')[1]
                i.value = params[valueKey]
            } 
        }
        if (i.meta && i.meta.url && i.meta.url.includes('$.') && props.meta.modal){
            const params = getParams(props.pageKey, props.meta.modal)
            if (params) {
                let urlParams = get_url_parm_list(i.meta.url)
                urlParams.forEach(p => {
                    if (p.val.startsWith('$.')) {
                        const valueKey = p.val.split('.')[1]
                        p.val = params[valueKey]
                    }
                })
                const urlWithoutParams = i.meta.url.split('?')[0]
                let paramsStr = '?';
                urlParams.forEach(p => {
                    paramsStr += `${p.key}=${p.val}&`
                })
                i.meta.url = `${urlWithoutParams}${paramsStr.slice(0, -1)}`
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
        i.__done = true
        app.hooks.beforeFormItemFinalization.call(app.config.appKey, props.pageKey, props.formKey, props, i)
    });
    
    const newItems = useSelect(props.pageKey, props.formKey, items.current, 1)

    app.hooks.beforeFormAllItemsFinalization.call(app.config.appKey, props.pageKey, props.formKey, props, newItems)
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
            labelPosition={props.meta.labelPosition}
            disableGroupCol={props.meta.disableGroupCol}
            actionsShow={props.meta.actionsShow}
            submitTitle={props.meta.submitTitle}
            clearTitle={props.meta.clearTitle}
            actionDirection={props.meta.actionDirection}
            clearButtonShow={props.meta.clearButtonShow}
            accessories={props.meta.accessories ? <Stack 
                pageKey={props.pageKey} 
                items={props.meta.accessories} 
                direction="vertical" 
                stackKey={`${props.pageKey}_${props.formKey}_accessories_stack`} 
                history={props.history}
                match={props.match}
            /> : undefined}
            onSubmit={(values: {[key: string]: any}) => {
                const keys = newItems.filter(i => !i.actionDisabled).map(i => i.key)
                let keyAliasMap: any = {}
                newItems.filter(i => i.alias).forEach(i => {
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
                            if (value && (value+'').startsWith('$.') && props.meta.modal) {
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