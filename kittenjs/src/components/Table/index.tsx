
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
        url: string,
        data?: {[x:string]: any},
        pageSize?: number,
        method: string
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
    const { dataSource, currentPage, total, pageSize, setCurrentPage,  setPageSize } = useTable(props.pageKey, props.tableKey, columns, props.meta);
    return (
        <k_table
            style={{
                ...props.style,
            }}
            appKey={app.config.appKey}
            pageKey={props.pageKey}
            className={props.className}
            rowKey={rowKey}
            columns={columns}
            dataSource={dataSource}
            onPageChange={(page: number, pSize: number) => {
                if (page !== currentPage) setCurrentPage(page)
                if (pSize !== pageSize) setPageSize(pSize)
            }}
            pagination={{
                current: currentPage,
                total: total,
                pageSize: pageSize,
                position: 'both'
            }}
        />
    );
};
Table.defaultProps = {
    method: 'GET',
};
