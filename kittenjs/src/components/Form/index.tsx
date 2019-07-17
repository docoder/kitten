import React from 'react'
import { App } from '../../app'
import useSelect from '../../hooks/useSelect'
import useSubmit from '../../hooks/useSubmit'
import Pages from '../../pages'

export type FormItem = {
    key: string, 
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

export default function Form (props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'form', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'form', props)
        }
    }, [])
    const items = useSelect(props.pageKey, props.formKey, props.items)
    const { setFilter } = Pages.useContainer()
    const { send } = useSubmit(props.meta.url, props.meta.method, props.pageKey, props.meta.modal)

    return (
        <k_form
            style={{
                ...props.style,
            }} 
            inModal={props.meta.modal && props.meta.modal.length > 0}
            className={props.className}
            items={items}
            onSubmit={(values: {[key: string]: any}) => {
                if(props.meta.filter) {
                    setFilter(props.pageKey, props.meta.filter,values) 
                }else {
                    send(values)
                }
            }}
        />
    );
};

Form.defaultProps = {
    method: 'POST',
};
