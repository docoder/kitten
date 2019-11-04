import React from 'react';
import {Table as AntTable} from 'ant-colony-ui';
import styled from 'styled-components';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import coy from 'react-syntax-highlighter/dist/esm/styles/prism/coy';
import moment from 'moment';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('sql', sql);
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
    // console.log('===TABLE-PROPS===:', props)
    const [ignored, _forceUpdate] = React.useReducer(x => x + 1, 0);
    function forceUpdate() {
        _forceUpdate(1);
    }
    props.columns.map ((c:any) => {
        if (c.actions && c.actions.length > 0) {
            c.width = 200
        }
        if (c.meta && c.meta.format && !c.render) {
            const format = c.meta.format.trim()
            if (format.startsWith('timestamp$:') || format.startsWith('date$:')){
                c.render = (text: string, record: any) => {
                    const codeFormat = format.split('$:').map((s: string) => s.trim()).filter((s: string) => s)
                    const timeFormat = codeFormat[1]
                    return text ? (
                        <span>{moment(new Date(format.startsWith('timestamp$:')?(+text):text)).format(timeFormat)}</span>
                    ): (<div></div>)
                }
            }
            if (format.startsWith('code$:')) {
                c.render = (text: string, record: any) => {
                    const codeLang = format.split('$:').map((s: string) => s.trim()).filter((s: string) => s)
                    const lang = codeLang[1].toLowerCase()
                    return text ? (
                        <SyntaxHighlighter language={lang} style={coy}>
                        {text}
                        </SyntaxHighlighter>
                    ): (<div></div>)
                }
            }
        }
        return {...c}
    })
    return (
        <>
        {props.title && <TableTitle>{props.title}:</TableTitle>}
        <StyledTable
            emptyAction={props.emptyAction}
            style={props.style}
            className={props.className}
            columns={props.columns}
            dataSource={props.dataSource}
            rowKey={props.rowKey}
            scrollWidth={(props.columns.length < 6) ? undefined : 1000}
            floatingScrollDomQuery=".ant-table-scroll .ant-table-body"
            columnsConfigGlobalTableKey={(props.columns.length < 6) ? undefined : `Kittenjs-Default-UI-Table-${props.appKey}-${props.pageKey}-${props.tableKey}`}
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

