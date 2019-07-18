import React from 'react'
import {App} from '../app'
import useGET from '../hooks/useGET'
import Pages from '../pages'

export default function useTable(
    pageKey: string,
    tableKey: string,
    columns: any[],
    meta: {
        url: string,
        data?: {[x:string]: any},
        pageSize?: number,
        method: string
    } 
): {dataSource: any[], currentPage: number, total: number, pageSize: number, setCurrentPage: Function, setPageSize: Function} {
    const app = React.useContext(App);
    const { send } = useGET()
    const filter = Pages.useContainer().getFilter(pageKey, tableKey)
    const dataType = "TABLE_DATA_FETCHED"
    const pageType = "TABLE_SET_CURRENT_PAGE"
    const sizeType = "TABLE_SET_PAGE_SIZE"
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
    const { currentPage, total, pageSize } = state
    const setCurrentPage = (page: number) => {
        dispatch({type: pageType, page})
    }
    const setPageSize = (size: number) => {
        dispatch({type: sizeType, size})
    }
    if (filter && filter.resetCurrentPage) {
        dispatch({type: pageType, page: 1})
        filter.resetCurrentPage = false
    }
    React.useEffect(() => {
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
                const result = await send(u, {...filter, currentPage, total, pageSize})
                if (result && result.data && result.data.list && result.data.total) {
                    dataSource = result.data.list
                    totalCount = result.data.total
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
            dispatch({type: dataType, dataSource: dataSource.map((d: any, i: number) => ({...d, key: i})), total: totalCount})
        }
        fetchTableData(pageKey, tableKey, meta.url);
    }, [pageKey, tableKey, meta.url, filter, currentPage, pageSize]);

    return {...state, setCurrentPage, setPageSize};
}
