import React from 'react'
import {App} from '../app'
import { useGET } from '../hooks/useGET'
import { Pages } from '../pages'
import { getValueByKeypath } from '../utils/modal'

export function useTable(
    pageKey: string,
    tableKey: string,
    columns: any[],
    meta: {
        url: string,
        data?: {[x:string]: any},
        pageSize?: number,
        alias?: {[x:string]: string},
        method: string
    },
    reload: number
): {dataSource: any[], currentPage: number, total: number, pageSize: number, setCurrentPage: Function, setPageSize: Function} {
    const app = React.useContext(App);
    const get = useGET()
    const filter = Pages.useContainer().getFilter(pageKey, tableKey)
    const dataType = `${pageKey.toUpperCase()}_${tableKey.toUpperCase()}_TABLE_DATA_FETCHED`
    const pageType = `${pageKey.toUpperCase()}_${tableKey.toUpperCase()}_TABLE_SET_CURRENT_PAGE`
    const sizeType = `${pageKey.toUpperCase()}_${tableKey.toUpperCase()}_TABLE_SET_PAGE_SIZE`
	const [state, dispatch] = React.useReducer(
		(state, action) => {
			switch (action.type) {
				case dataType:
                    return { ...state, dataSource: action.dataSource, total: action.total };
                case pageType:
                    return { ...state, currentPage: action.page} 
                case sizeType:
                    return { ...state, pageSize: action.size}
				default:
					throw new Error();
			}
		},
		{ dataSource: [], currentPage: 1, total: 0, pageSize: meta.pageSize || 20 }
    );
    const { currentPage, pageSize } = state
    const setCurrentPage = React.useCallback(
        (page: number) => {
            dispatch({type: pageType, page})
        },
        []
    )
    const setPageSize = React.useCallback((size: number) => {
            dispatch({type: sizeType, size})
        },
        []
    )
    if (filter && filter.resetCurrentPage) {
        dispatch({type: pageType, page: 1})
        delete filter.resetCurrentPage
    }
    React.useEffect(() => {
        let mounted = true
        async function fetchTableData(p: string, t: string, u: string) {
            app.hooks.beforeTableDataSourceFetched.call(
                app.config.appKey,
                p,
                t,
                columns,
            );
            let dataSource = []
            let totalCount = 0
            if (meta.data) {
                dataSource = meta.data.filter((d: any) => {
                    if (!filter || !filter.type) return true;
                    else return d.typeId === filter.type;
                })
                totalCount = dataSource.length
            } else {
                //TODO: doc: {code: 0, data: {list: [...], total: xxx}}
                let currentPageKey = 'currentPage'
                let pageSizeKey = 'pageSize'
                let listKey = 'list'
                let totalKey = 'total'
                if (meta.alias) {
                    if (meta.alias.currentPage) currentPageKey = meta.alias.currentPage
                    if (meta.alias.pageSize) pageSizeKey = meta.alias.pageSize
                    if (meta.alias.list) listKey = meta.alias.list
                    if (meta.alias.total) totalKey = meta.alias.total
                }
                const result = await get(u, {...filter, [currentPageKey]: currentPage, [pageSizeKey]: pageSize})
                let list = getValueByKeypath(result.data, listKey)
                let total = getValueByKeypath(result.data, totalKey)
                if (result && result.data && list && total) {
                    dataSource = list
                    totalCount = total
                }
            }
            app.hooks.afterTableDataSourceFetched.call(
                app.config.appKey,
                p,
                t,
                columns,
                dataSource,
            );
            //TODO: doc: better to config "id: true", or use index key
            if (mounted) dispatch({type: dataType, dataSource: dataSource.map((d: any, i: number) => ({...d, key: i})), total: totalCount})
        }
        fetchTableData(pageKey, tableKey, meta.url);
        return () => {mounted = false}
    }, [pageKey, tableKey, meta.url, filter, currentPage, pageSize, reload]);

    return {...state, setCurrentPage, setPageSize};
}
