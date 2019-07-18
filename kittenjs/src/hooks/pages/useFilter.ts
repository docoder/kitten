import React from 'react'
export default function useFilter() {
    const [_filter, _setFilter] = React.useState<{[x: string]: {[x:string]: any}}>({})
    const getFilter = (pageKey: string, tableKey: string) => {
        const f = _filter[`${pageKey}_${tableKey}`]
        return f;
    }
    const setFilter = (pageKey: string, tableKey: string, values: {[x:string]: any}) => {
        values.resetCurrentPage = true
        _setFilter({
            ..._filter,
            [`${pageKey}_${tableKey}`]: values
        })
    }
    return { getFilter, setFilter }
}