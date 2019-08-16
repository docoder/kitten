import React from 'react';
import {Table as AntTable} from 'ant-colony-ui';
export function Table(props: {[propName: string]: any}) {
    console.log('===TABLE-PROPS===:', props)
    return (
        <AntTable
            style={props.style}
            className={props.className}
            columns={props.columns}
            dataSource={props.dataSource}
            rowKey={props.rowKey}
            scrollWidth={1000}
            floatingScrollDomQuery=".ant-table-scroll .ant-table-body"
            columnsConfigGlobalTableKey={`Kitten-Reconciler-UI-Table-${props.appKey}-${props.pageKey}`}
            pagination={props.pagination}
            onChange={(pagination: any) => {
               props.onPageChange(pagination.current, pagination.pageSize) 
            }}
        />
    ) 
}

