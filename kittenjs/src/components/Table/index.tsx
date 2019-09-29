
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
        data?: any,
        pageSize?: number,
        form?: string,
        method: string,
        params?: {form: {key: string, fields: string[]}},
        rowAction?: string
        label?: string
        modal?: string
        disablePagination?: boolean
        link?: string
    } 
    columns: (TableColumn[]);
    pageKey: string;
    tableKey: string;
    forceUpdate: Function;
    history: any;
}

function _Table(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'table', props.tableKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'table', props.tableKey, props)
        }
    }, [])
    const { showModal, setParams, getParams } = Pages.useContainer()
    const keyItem = props.columns.find(c => !!c.id)
    const rowKey = keyItem ? keyItem.key : 'key'
    const get = useGET()
    const post = usePOST()
    const [reload, _forceReload] = React.useReducer(x => x + 1, 0);
    function forceReload() {
        _forceReload(1);
    }


    let metaDataSource: any[] = []
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
    let emptyAction: any = undefined
    
    columns = columns.map((c: TableColumn) => {
        let actions: any = c.actions
        
        if (c.actions && c.actions.length > 0) {
            const blankValue: any = {}
            const insertAction = (index: number) => {
                metaDataSource = metaDataSource || [];
                metaDataSource.splice(index+1, 0, {
                    ...blankValue,
                    [rowKey]: new Date().getTime(),
                })
                forceReload()
            }
            actions = c.actions.map((a: TableAction) => {
                if (a.meta.rowAction && a.meta.rowAction === 'insert') {
                    emptyAction = {}
                    emptyAction.title = a.meta.label
                    emptyAction.callback = () => {insertAction(0)}
                }
                let actionShow: any = true
                if ((typeof a.meta.show) === 'boolean') {
                    actionShow = !!a.meta.show
                }else if (a.meta.show && (typeof a.meta.show) === 'string' ) {
                    const showString = a.meta.show as string
                    if (showString.startsWith('$.')) {
                        actionShow = (text: string, record: any, index: number) => {
                            const valueKey = showString.split('.')[1]
                            return !!record[valueKey]
                        }
                    }
                }
                return {
                    key: a.key,
                    label: a.meta.label,
                    confirm: a.meta.confirm,
                    confirmLabel: a.meta.confirmLabel,
                    show: actionShow,
                    callback: (text: string, record: any, index: number) => {
                        if (a.meta.rowAction) {
                            const keys = Object.keys(record)
                            
                            keys.forEach((k: string) => {
                                blankValue[k] = undefined
                            })
                            if (a.meta.rowAction === 'insert') {
                                insertAction(index) 
                            }
                            else if (a.meta.rowAction === 'delete' && metaDataSource ){
                                metaDataSource = metaDataSource.slice(0).filter((d: any) => d[rowKey] !== record[rowKey]) 
                                handleFormData(metaDataSource)
                                forceReload()
                            }
                        }else if (a.meta.link) {
                            const link = a.meta.link
                            if(link.startsWith('/')) {
                                props.history.push(link.substring(1))
                            }else {
                                props.history.push(`${props.pageKey}/${link}`) 
                            }
                        }else {
                            extraRequest(a.meta, record)
                        }
                    },
                    modal: a.meta ? a.meta.modal: null
                }
            })
        }

        app.hooks.beforeTableColumnFinalization.call(app.config.appKey, props.pageKey, props.tableKey, c);
        return {...c, actions, dataIndex: c.key, title: c.label}
    })
    
    if (props.meta.data && typeof props.meta.data === 'string') {
        if (props.meta.modal && props.meta.data.startsWith('$.')) {
            const params = getParams(props.pageKey, props.meta.modal)
            if (params) {
                const valueKey = props.meta.data.split('.')[1]
                const data = params[valueKey]
                if (data && Array.isArray(data)) {
                    metaDataSource = data.map((d:any, index: number) => ({
                        ...d, 
                        [rowKey]: (d[rowKey] || index)
                    }))
                }else {
                    metaDataSource = []
                }
            }else {
                metaDataSource = []
            }
        }else{
            metaDataSource = []
        }
    }else {
        metaDataSource = props.meta.data
    }
    
    function handleFormData(dataSource: any[]) {
        if(props.meta.form) {
            let ps: any = { list: dataSource }
            if (props.meta.params && props.meta.params.form) {
                const { key, fields } = props.meta.params.form
                ps = {}
                if (fields && fields.length > 0) {
                    ps[key] = dataSource.map((d:any) => {
                        let data: any = {}
                        Object.keys(d).forEach((k:string) => {
                            if (fields.includes(k)) {
                                data[k] = d[k]
                            }
                        })
                        return data
                    })
                }else {
                    ps[key] = dataSource
                }
                
            }  
            const lastParams = getParams(props.pageKey, props.meta.form) 
            const newParams = lastParams ? {...lastParams, ...ps} : ps;
            setParams(props.pageKey, props.meta.form, newParams)
        }
    }

    const Comp = app.ui? app.ui.Table : null

    function renderTable(dataSource: any[], pagination: any) {
        const values = getParams(props.pageKey, props.tableKey) 
        if (values && Object.keys(values).length > 0) {
            dataSource.push({[rowKey]: new Date().getTime(), ...values})
            setParams(props.pageKey, props.tableKey, {})
            setTimeout(() => {
                handleFormData(dataSource)
            }, 0);
        } 
        return (<Comp
                style={{
                    ...props.style,
                }}
                emptyAction={emptyAction}
                title={props.meta.label}
                appKey={app.config.appKey}
                pageKey={props.pageKey}
                tableKey={props.tableKey}
                className={props.className}
                rowKey={rowKey}
                columns={columns}
                dataSource={dataSource}
                onPageChange={pagination ? (page: number, pSize: number) => {
                    if (page !== pagination.currentPage) pagination.setCurrentPage(page)
                    if (pSize !== pagination.pageSize) pagination.setPageSize(pSize)
                } : undefined}
                onCellChanged={(dataSource: any[], row: any, key: string) => {
                    app.hooks.afterTableCellChanged.call(app.config.appKey, props.pageKey, props.tableKey, dataSource, row);
                    // const column = props.columns.find((c: any) => c.key === key)
                    // if (column && column.meta) {
                    //     extraRequest(column.meta, row)
                    // }
                    handleFormData(dataSource) 
                }}
                pagination={pagination ? {
                    current: pagination.currentPage,
                    total: pagination.total,
                    pageSize: pagination.pageSize,
                    position: 'both'
                }: false}
            />)
    }

    if (props.meta && props.meta.url) {
        const { dataSource, currentPage, total, pageSize, setCurrentPage,  setPageSize } = useTable(props.pageKey, props.tableKey, columns, props.meta, reload);
        return renderTable(dataSource, props.meta.disablePagination ? false : {currentPage, total, pageSize, setCurrentPage,  setPageSize});
    }else {
        return renderTable(metaDataSource || [], false);
    }
    
};
export const Table = React.memo(_Table)