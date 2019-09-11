import React from 'react'
import { App, PageSection } from '../../app'
import { Button } from '../Button'
import { Table } from '../Table'
import { Form } from '../Form'
import { Modal } from '../Modal'
import { Checkbox } from '../Checkbox'
interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    items: PageSection[];
    direction: string;
    stackKey: string;
}

function _Stack(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'stack', props.stackKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'stack', props.stackKey, props)
        }
    }, [])
    const vertical = props.direction === 'vertical'
    const [ignored, _forceUpdate] = React.useReducer(x => x + 1, 0);
    function forceUpdate() {
        _forceUpdate(1);
    }
    return (
        <div style={{
                display: 'flex', 
                flexDirection: vertical ? 'column' : 'row', 
                ...props.style
            }}>
            {props.items.map((c: any) => {
                switch (c.type) {
                    case 'Table':
                        return (
                            <Table
                                pageKey={props.pageKey}
                                tableKey={c.key}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...c.meta.style}}
                                key={c.key}
                                columns={c.items}
                                meta={c.meta}
                                forceUpdate={forceUpdate}
                            />
                        );
                    case 'Form':
                        return (
                            <Form
                                pageKey={props.pageKey}
                                formKey={c.key}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...c.meta.style}}
                                key={c.key}
                                items={c.items}
                                meta={c.meta}
                                forceUpdate={forceUpdate}
                            />
                        )
                    case 'Stack':
                        return (
                            <Stack 
                                key={c.key}
                                pageKey={props.pageKey}
                                stackKey={c.key}
                                items={c.items}
                                direction={c.meta.direction}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...c.meta.style}}
                            />
                        )
                    case 'Button':
                        return (
                            <Button
                                key={c.key}
                                pageKey={props.pageKey}
                                buttonKey={c.key}
                                meta={c.meta}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...c.meta.style}}
                                forceUpdate={forceUpdate}
                            />
                        )
                    case 'Modal': 
                        return (
                            <Modal
                                key={c.key}
                                pageKey={props.pageKey}
                                modalKey={c.key}
                                contens={c.items}
                                title={c.meta.label}
                                width={c.meta.width}
                                forceUpdate={forceUpdate}
                                style={c.meta.style}
                            />
                        )
                    case 'Checkbox':
                        return (
                            <Checkbox
                                key={c.key}
                                pageKey={props.pageKey}
                                checkboxKey={c.key}
                                meta={c.meta}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...c.meta.style}}
                                forceUpdate={forceUpdate}
                            />
                        )
                    default:
                        return null
                }
        })}
        </div>
    );
};

export const Stack = React.memo(_Stack)