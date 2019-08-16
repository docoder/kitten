
import React from 'react';
import { App, PageSectionItem, TableAction } from '../../app';
import { useTable } from '../../hooks/useTable'
import { Pages } from '../../pages'
export interface TableColumn extends PageSectionItem {
    render?: any
    editable?: any
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

function _Table(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'table', props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'table', props)
        }
    }, [])
    const { showModal } = Pages.useContainer()
    const keyItem = props.columns.find(c => !!c.id)
    const rowKey = keyItem ? keyItem.key : 'key'
    const columns = props.columns.map((c: TableColumn) => {
        if (c.actions && c.actions.length > 0) {
            c.actions = c.actions.map((a: TableAction) => ({
                key: a.key,
                label: a.label,
                callback: (text: string, record: any, index: number) => {
                    if (a.modal && a.modal.length > 0) {
                        showModal(props.pageKey, a.modal)
                    } 
                },
                show: true,
                modal: a.modal
            }))
        }
        app.hooks.beforeTableColumnFinalization.call(app.config.appKey, props.pageKey, c);
        return {...c, dataIndex: c.key, title: c.label}
    })
    const { dataSource, currentPage, total, pageSize, setCurrentPage,  setPageSize } = useTable(props.pageKey, props.tableKey, columns, props.meta);
    const Comp = app.ui? app.ui.Table : null
    return (
        <Comp
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
export const Table = React.memo(_Table)