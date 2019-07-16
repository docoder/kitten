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
        method: string
    } 
): any[] {
    const app = React.useContext(App);
    const { send } = useGET()
    const filter = Pages.useContainer().getFilter(pageKey, tableKey)
    const type = "TABLE_DATA_FETCHED";
	const [state, dispatch] = React.useReducer(
		(state, action) => {
			switch (action.type) {
				case type:
					return { ...state, data: action.data };
				default:
					throw new Error();
			}
		},
		{ data: [] }
	);
    React.useEffect(() => {
        async function fetchTableData(p: string, t: string, u: string) {
            app.hooks.beforeTableDataSourceFetched.call(
                app.config.appKey,
                p,
                t,
                columns,
            );
            const dataSource = meta.data ? meta.data.filter((d: any) => {
                if (!filter || !filter.type) return true;
                else return d.typeId === filter.type;
            }) : await send(u, filter)
            app.hooks.afterTableDataSourceFetched.call(
                app.config.appKey,
                p,
                t,
                columns,
                dataSource,
            );
            if (dataSource && dataSource.length > 0) {
                dispatch({type, data: dataSource});
            }
        }
        fetchTableData(pageKey, tableKey, meta.url);
    }, [pageKey, meta.url, filter]);
    return state.data;
}
