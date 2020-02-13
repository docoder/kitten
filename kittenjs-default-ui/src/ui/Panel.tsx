import React from 'react'
import { Panel as AntPanel } from 'ant-colony-ui';
import styled from 'styled-components';

const StyledPanel = styled(AntPanel)`
    margin-bottom: 10px;
    width: ${props => props.width};
    
    ${props => props.hasgrids ? 'padding-left: 5px; padding-right:5px;': ''};
    & .ant-card-head {
        background-color: ${props => props.headerbgcolor};
        color: ${props => props.headercolor};
    }
`;
const StyledGrid = styled(AntPanel.Grid)`
`;
const GridTitle = styled.span`
    color: #999;
`;

export function Panel(props: {[propName: string]: any}) {
    // console.log('===PANEL-PROPS===:', props)
    let columnCount = 4
    if (props.columnsCount) {
        columnCount = parseInt(props.columnsCount) || 4
    }else {
        const itemsCount = props.items.length
        if (itemsCount < 4 && itemsCount > 0) columnCount = itemsCount
    }
    const itemWidth = 100.0/columnCount
    
    return (
        <StyledPanel
            title={props.title}
            width={props.width}
            hasgrids={props.items.length > 0}
            headercolor={props.headerColor}
            headerbgcolor={props.headerBgColor}
            
        >
            {
                props.items.length > 0 ? props.items.map((i:any) => {
                    let fsize = 0
                    if (i.size === 'big' || (i.meta && i.meta.size && i.meta.size === 'big')) {
                        fsize = 16
                    }
                    else if (i.size === 'extrabig' || (i.meta && i.meta.size && i.meta.size === 'extrabig')) {
                        fsize = 30
                    }
                    const itemStyle: any = fsize ? {fontSize: fsize, fontWeight: 'bold'}:{}
                    let itemElement = <span onClick={i.onClick} style={ i.onClick ? {
                        ...itemStyle, 
                        color: '#1890ff',
                        textDecoration: 'none',
                        backgroundColor: 'transparent',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.3s'
                    } : itemStyle}>{i.value}</span>
                    if (i.meta && i.meta.href) {
                        itemElement = <a style={itemStyle} href={i.meta.href}>{i.value}</a>
                    }
                    return (
                        <StyledGrid
                            key={i.key}
                            width={`${itemWidth}%`}
                        >
                            <GridTitle>{i.label ? (typeof i.label === 'string' && i.label.trim() ? `${i.label}: `: ''): ''}</GridTitle>
                            {itemElement}
                        </StyledGrid>
                        )
                }): props.children
            }
        </StyledPanel>
    )
}