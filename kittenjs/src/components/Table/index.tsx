
import React from 'react';
import { App, PageSectionItem, TableAction } from '../../app';
import { useTable } from '../../hooks/useTable'
import { Pages } from '../../pages'
import { useGET } from '../../hooks/useGET'
import { usePOST } from '../../hooks/usePOST'
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
    forceUpdate: Function;
}

function _Table(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'table', props.tableKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'table', props.tableKey, props)
        }
    }, [])
    const { showModal, setParams } = Pages.useContainer()
    const keyItem = props.columns.find(c => !!c.id)
    const rowKey = keyItem ? keyItem.key : 'key'
    const get = useGET()
    const post = usePOST()
    const columns = props.columns.map((c: TableColumn) => {
        let actions: any = c.actions
        if (c.actions && c.actions.length > 0) {
            actions = c.actions.map((a: TableAction) => ({
                key: a.key,
                label: a.meta.label,
                confirm: a.meta.confirm,
                confirmLabel: a.meta.confirmLabel,
                callback: async (text: string, record: any, index: number) => {
                    let result: any = null
                    if (a.meta.url) {
                        if (!a.meta.method || a.meta.method.toUpperCase() === 'GET') {
                            result = await get (a.meta.url) || []
                        }else if (a.meta.method.toUpperCase() === 'POST') {
                            const values:any = {}
                            const params = a.meta.params
                            if (params && params.post) {
                                const post = params.post
                                Object.keys(post).forEach((k:any) => {
                                    const value = post[k]
                                    if (value.startsWith('$.')) {
                                        values[k] = record[value.split('.')[1]] 
                                    }else {
                                        values[k] = value
                                    }
                                })
                            }
                            result = await post(a.meta.url, values)
                            if (result) setParams(props.pageKey, props.tableKey, {[a.key]: result.data})
                        }
                    }
                    let params: any = null
                    if (a.meta.params && Object.keys(a.meta.params).length > 0) {
                        const aParams = a.meta.params
                        params = {}
                        let keys = Object.keys(a.meta.params)
                        keys.forEach(k => {
                            if (k === 'post' || k === 'get') return
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