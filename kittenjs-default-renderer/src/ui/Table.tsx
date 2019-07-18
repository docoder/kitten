import React from 'react';
import ReactDOM from 'react-dom';
import {Table} from 'ant-colony-ui';

export default function _Table(dom: HTMLElement, props: {[propName: string]: any}) {
    
    console.log('===TABLE-PROPS===:', props)
    ReactDOM.render(
        <Table
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
        />,
        dom,
    );
}

