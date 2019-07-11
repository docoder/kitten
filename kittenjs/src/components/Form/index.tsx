import React from 'react'
import { App } from '../../app'
import useSelect from '../../hooks/useSelect'
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
    return (
        <form
            style={{
                ...props.style,
            }} 
            className={props.className}
            items={items}
            onSubmit={(values: {[key: string]: any}) => {

                if(props.meta.filter) {
                    const { setFilter } = Pages.useContainer()
                    setFilter(props.pageKey, props.meta.filter,values) 
                }
                console.log('===VALUES===:', values)
                console.log('===URL===:', props.meta.url, props.meta.method)
                //TODO: use real data
            }}
        />
    );
};

Form.defaultProps = {
    method: 'POST',
};
