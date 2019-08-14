import React from 'react';
import ReactDOM from 'react-dom';
import {Table as AntTable} from 'ant-colony-ui';
import styled from 'styled-components';
const StyledTable = styled(AntTable)`
    margin-top: ${props => props.blank ? '0px': '-20px'};
`;
export function Table(dom: HTMLElement, props: {[propName: string]: any}) {
    
    console.log('===TABLE-PROPS===:', props)
    ReactDOM.render(
        <StyledTable
            columns={props.columns}
            dataSource={props.dataSource}
            rowKey={props.rowKey}
            scrollWidth={1000}
            floatingScrollDomQuery=".ant-table-scroll .ant-table-body"
            columnsConfigGlobalTableKey={`Kitten-Reconciler-UI-Table-${props.appKey}-${props.pageKey}`}
            pagination={props.pagination}
            blank={props.pagination.total <= 0}
            onChange={(pagination: any) => {
               props.onPageChange(pagination.current, pagination.pageSize) 
            }}
        />,
        dom,
    );
}

