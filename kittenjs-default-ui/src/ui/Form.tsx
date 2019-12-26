import React from 'react'
import {Form as AntForm} from 'ant-colony-ui';
import styled from 'styled-components';
import moment from 'moment';
const ModalForm = styled(AntForm)`
    & .ant-form {
        background: white;
        border: 0px;
        border-radius: 0px;
        padding: 0px;
    }
    & .ant-row {
        padding: 0px;
    }
    & .ant-checkbox-group .ant-col {
        ${props => props.discol ? 'width: auto;' : ''};
    }

    & .ant-form-item-children .ant-checkbox-group {
        margin-bottom: -8px;
    }

    & .ant-row .ant-form-item-children .ant-radio-group {
        margin-bottom: -8px;
    }
    
`;
const AccessoriesContainer = styled.div`
    margin-bottom: 20px;
`
export function Form(props: {[propName: string]: any}) {
    // console.log('===FORM-PROPS===:', props)
    const RealForm = props.inModal ? ModalForm : AntForm
    props.items.map ((i:any) => {
        if (i.type === 'checkbox' || i.type === 'radio') {
            i.data = i.meta.data
        }
        if (i.meta && i.meta.format && i.value && !i.formated && i.disabled) {
            const format = i.meta.format.trim()
            if (format.startsWith('timestamp$:') || format.startsWith('date$:')){
                const codeFormat = format.split('$:').map((s: string) => s.trim()).filter((s: string) => s)
                const timeFormat = codeFormat[1]
                i.value = moment(new Date(format.startsWith('timestamp$:')?(+i.value):i.value)).format(timeFormat)
                i.formated = true
            }
        }
        return {...i}
    })
    const onSubmit = (values: any, ...rest: any[]) => {
        // props.items.forEach((i: any) => {
        //     if (i.type === 'date' || i.type === 'month') {
        //         if (values[i.key]) {
        //             values[i.key] = values[i.key].valueOf()
        //         }
        //         if (i.meta && i.meta.format) {
                    
        //         }
        //     }else if (i.type === 'rangeDate') {
        //         if (values[i.key] && values[i.key].length > 1) {
        //             values[i.key] = [values[i.key][0].valueOf(), values[i.key][1].valueOf()]
        //         }
        //     }
        // })
        props.onSubmit(values, ...rest)
    }
    return (
        <div
            style={props.style}
            className={props.className}
        >
            <RealForm
                forms={props.items}
                onSubmit={onSubmit}
                actionsShow={props.actionsShow}
                submitTitle={props.submitTitle}
                clearTitle={props.clearTitle}
                actionDirection={props.actionDirection || "right"}
                clearButtonShow={props.clearButtonShow}
                columnCount={props.columnsCount ? props.columnsCount : (props.inModal ? 1 : 4)}
                rowColCounts={props.rowColCounts}
                labelPostion={props.labelPosition}
                discol={props.disableGroupCol}
                disableEnterSubmit={false}
                accessoryComponent={props.accessories ? () => <AccessoriesContainer>{props.accessories}</AccessoriesContainer>: undefined}
            />
        </div>
        
    ) 
}
