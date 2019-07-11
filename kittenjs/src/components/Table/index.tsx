
import React from 'react';
import { App } from '../../app';
import useTable from '../../hooks/useTable'

export type TableColumn = {
    key: string,
    label: string,
    editable?: {[key: string]: any},
    render?: {[key:string]: any},
    id?: boolean
}

interface IProps {
    style?: React.CSSProperties;
    className?: string;
    meta: {
        data?: {[x:string]: any};
        url: string;
        method: string;
    }
    columns: (TableColumn[]);
    pageKey: string;
    tableKey: string;
}

export default function Table(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'table', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'table', props)
        }
    }, [])
    const keyItem = props.columns.find(c => !!c.id)
    const rowKey = keyItem ? keyItem.key : 'key'
    const columns = props.columns.map((c: {[propName: string]: any}) => {
        app.hooks.beforeTableColumnFinalization.call(app.config.appKey, props.pageKey, c);
        return {...c, dataIndex: c.key, title: c.label}
    })
    const dataSource = useTable(props.pageKey, props.tableKey, columns, props.meta);
    return (
        <table
            style={{
                ...props.style,
            }}
            appKey={app.config.appKey}
            pageKey={props.pageKey}
            className={props.className}
            rowKey={rowKey}
            columns={columns}
            dataSource={dataSource}
        />
    );
};
Table.defaultProps = {
    method: 'GET',
};
