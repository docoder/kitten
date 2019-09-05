import React from 'react';
import {Table as AntTable} from 'ant-colony-ui';
import styled from 'styled-components';

const StyledTable = styled(AntTable)`
	& .editable-row .editable-cell-value-wrap {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 11px;
        min-height: 32px;
    }
`;
const TableTitle = styled.div`
    color: rgba(0, 0, 0, 0.85);
    font-size: 12px;
    margin-bottom: 10px;
`

export function Table(props: {[propName: string]: any}) {
    console.log('===TABLE-PROPS===:', props)
    const [ignored, _forceUpdate] = React.useReducer(x => x + 1, 0);
    function forceUpdate() {
        _forceUpdate(1);
    }
    props.columns.map ((c:any) => {
        if (c.actions && c.actions.length > 0) {
            c.width = 200
        }
        return {...c}
    })
    return (
        <>
        {props.title && <TableTitle>{props.title}:</TableTitle>}
        <StyledTable
            style={props.style}
            className={props.className}
            columns={props.columns}
            dataSource={props.dataSource}
            rowKey={props.rowKey}
            scrollWidth={props.form ? undefined : 1000}
            floatingScrollDomQuery=".ant-table-scroll .ant-table-body"
            columnsConfigGlobalTableKey={props.form ? undefined : `Kittenjs-Default-UI-Table-${props.appKey}-${props.pageKey}-${props.tableKey}`}
            pagination={props.pagination}
            onChange={(pagination: any) => {
                props.onPageChange(pagination.current, pagination.pageSize) 
            }}
            onCellSave={(row: any, dataIndex: string) => {
                let newList = props.dataSource.slice(0);
                let newItem = newList.find((s:any) => s.key === row.key);
                const editableKeys = props.columns.filter( (c:any) => c.editable).map((e:any) => e.dataIndex)
                editableKeys.forEach((k:string) => {
                    newItem[k] = row[k]
                })
                if (props.onCellChanged) props.onCellChanged(newList, row,dataIndex) 
                forceUpdate()
            }}
        />
        </>
    ) 
}

