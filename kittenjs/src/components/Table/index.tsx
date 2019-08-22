
import React from 'react';
import { App, PageSectionItem, TableAction } from '../../app';
import { useTable } from '../../hooks/useTable'
import { Pages } from '../../pages'
import { useGET } from '../../hooks/useGET'
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
    const { showModal, setParams } = Pages.useContainer()
    const keyItem = props.columns.find(c => !!c.id)
    const rowKey = keyItem ? keyItem.key : 'key'
    const get = useGET()
    const columns = props.columns.map((c: TableColumn) => {
        let actions: any = c.actions
        if (c.actions && c.actions.length > 0) {
            actions = c.actions.map((a: TableAction) => ({
                key: a.key,
                label: a.meta.label,
                callback: async (text: string, record: any, index: number) => {
                    let result: any = null
                    if (a.meta.url) {
                        if (a.meta.method === 'GET' || !a.meta.method) {
                            result = await get (a.meta.url) || []
                        } 
                    }
                    let params: any = null
                    if (a.meta.params && Object.keys(a.meta.params).length > 0) {
                        const aParams = a.meta.params
                        params = {}
                        let keys = Object.keys(a.meta.params)
                        keys.forEach(k => {
                            const value = aParams[k] 
                            if (value.startsWith('$.')) {
                                params[k] = record[value.split('.')[1]] 
                            }else if(value.startsWith('$#') && result) {
                                params[k] = result.data[value.split('#')[1]]
                            }else {
                                params[k] = value
                            }
                        });
                    }

                    if (a.meta.modal && a.meta.modal.length > 0) {
                        if (params) setParams(props.pageKey, a.meta.modal, params)
                        showModal(props.pageKey, a.meta.modal)
                    } 
                },
                show: true,
                modal: a.meta ? a.meta.modal: null
            }))
        }
        app.hooks.beforeTableColumnFinalization.call(app.config.appKey, props.pageKey, props.tableKey, c);
        return {...c, actions, dataIndex: c.key, title: c.label}
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