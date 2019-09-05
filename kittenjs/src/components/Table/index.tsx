
import React from 'react';
import { App, PageSectionItem, TableAction } from '../../app';
import { useTable } from '../../hooks/useTable'
import { Pages } from '../../pages'
import { useGET } from '../../hooks/useGET'
import { usePOST } from '../../hooks/usePOST'
import { useSelect } from '../../hooks/useSelect'
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
        form?: string,
        method: string,
        params?: {form: {key: string, fields: string[]}},
        rowAction?: string
        label?: string
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
    const [reload, _forceReload] = React.useReducer(x => x + 1, 0);
    function forceReload() {
        _forceReload(1);
    }
    async function extraRequest(meta: any, record: any) {
        let result: any = null
        if (meta.url) {
            const params = meta.params
            if (!meta.method || meta.method.toUpperCase() === 'GET') {
                let url = meta.url
                let reqString='?'
                if (params && params.get) {
                    const get = params.get
                    Object.keys(get).forEach((k:any) => {
                        const value = get[k]
                        if (value.startsWith('$.')) {
                            reqString += `${k}=${record[value.split('.')[1]]}&`  
                        }else {
                            reqString += `${k}=${value}&`
                        }
                    })
                    url += reqString.substring(0, reqString.length - 1)
                }
                result = await get (url) || []
            }else if (meta.method.toUpperCase() === 'POST') {
                const values:any = {}
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
                result = await post(meta.url, values)
                if (result) forceReload()
                
            }
        }
        let params: any = {}
        if (meta.params && Object.keys(meta.params).length > 0) {
            const aParams = meta.params
            params = {}
            let keys = Object.keys(meta.params)
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
        if (meta.modal && meta.modal.length > 0) {
            setParams(props.pageKey, meta.modal, {...params, forceReload: forceReload })
            showModal(props.pageKey, meta.modal)
        }
    }
    let columns: any [] = useSelect(props.pageKey, props.tableKey, props.columns)
    columns = columns.map((c: TableColumn) => {
        let actions: any = c.actions
        if (c.actions && c.actions.length > 0) {
            actions = c.actions.map((a: TableAction) => ({
                key: a.key,
                label: a.meta.label,
                confirm: a.meta.confirm,
                confirmLabel: a.meta.confirmLabel,
                callback: (text: string, record: any, index: number) => {
                    if (a.meta.rowAction) {
                        if (a.meta.rowAction === 'insert') {
                            props.meta.data = props.meta.data || [];
                            props.meta.data.splice(index+1, 0, {
								...record,
                                [rowKey]: new Date().getTime(),
                            })
                            forceReload() 
                        }
                        else if (a.meta.rowAction === 'delete' && props.meta.data && props.meta.data.length > 1){
                            props.meta.data = props.meta.data.slice(0).filter((d: any) => d[rowKey] !== record[rowKey]) 
                            forceReload()
                        }
                    }else {
                        extraRequest(a.meta, record)
                    }
                },
                show: true,
                modal: a.meta ? a.meta.modal: null
            }))
        }
        app.hooks.beforeTableColumnFinalization.call(app.config.appKey, props.pageKey, props.tableKey, c);
        return {...c, actions, dataIndex: c.key, title: c.label}
    })
    
    const Comp = app.ui? app.ui.Table : null
    if (props.meta && props.meta.url) {
        const { dataSource, currentPage, total, pageSize, setCurrentPage,  setPageSize } = useTable(props.pageKey, props.tableKey, columns, props.meta, reload);
        return (
            <Comp
                style={{
                    ...props.style,
                }}
                title={props.meta.label}
                appKey={app.config.appKey}
                pageKey={props.pageKey}
                tableKey={props.tableKey}
                className={props.className}
                rowKey={rowKey}
                columns={columns}
                dataSource={dataSource}
                onPageChange={(page: number, pSize: number) => {
                    if (page !== currentPage) setCurrentPage(page)
                    if (pSize !== pageSize) setPageSize(pSize)
                }}
                onCellChanged={(dataSource: any[], row: any, key: string) => {
                    app.hooks.afterTableCellChanged.call(app.config.appKey, props.pageKey, props.tableKey, dataSource, row);
                    const column = props.columns.find((c: any) => c.key === key)
                    if (column && column.meta) {
                        extraRequest(column.meta, row)
                    }
                }}
                pagination={{
                    current: currentPage,
                    total: total,
                    pageSize: pageSize,
                    position: 'both'
                }}
            />
        );
    }else {
        return (
            <Comp
                style={{
                    ...props.style,
                }}
                title={props.meta.label}
                appKey={app.config.appKey}
                pageKey={props.pageKey}
                tableKey={props.tableKey}
                className={props.className}
                rowKey={rowKey}
                columns={columns}
                dataSource={props.meta.data}
                form={props.meta.form}
                onCellChanged={(dataSource: any[], row: any, key: string) => {
                    app.hooks.afterTableCellChanged.call(app.config.appKey, props.pageKey, props.tableKey, dataSource, row);
                    const column = props.columns.find((c: any) => c.key === key)
                    if (column && column.meta) {
                        extraRequest(column.meta, row)
                    }
                    if(props.meta.form) {
                        let params: any = { list: dataSource }
                        if (props.meta.params && props.meta.params.form) {
                            const { key, fields } = props.meta.params.form
                            params = {}
                            if (fields && fields.length > 0) {
                                params[key] = dataSource.map((d:any) => {
                                    let data: any = {}
                                    Object.keys(d).forEach((k:string) => {
                                        if (fields.includes(k)) {
                                            data[k] = d[k]
                                        }
                                    })
                                    return data
                                })
                            }else {
                                params[key] = dataSource
                            }
                            
                        }
                        setParams(props.pageKey, props.meta.form, params)
                    }
                }}
            />
        )
    }
    
};
export const Table = React.memo(_Table)