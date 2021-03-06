import React from 'react'
import { App, PageSection } from '../../app'
import { Button } from '../Button'
import { Table } from '../Table'
import { Form } from '../Form'
import { Modal } from '../Modal'
import { Checkbox } from '../Checkbox'
import { Tabs } from '../Tabs'
import { Panel } from '../Panel'
import { Iframe } from '../Iframe'
interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    items: PageSection[];
    direction: string;
    stackKey: string;
    history: any;
    match: any;
}

function _Stack(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'Stack', props.stackKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'Stack', props.stackKey, props)
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
                const meta = c.meta || {}
                switch (c.type) {
                    case 'Table':
                        return (
                            <Table
                                pageKey={props.pageKey}
                                tableKey={c.key}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...meta.style}}
                                key={c.key}
                                columns={c.items}
                                meta={meta}
                                forceUpdate={forceUpdate}
                                history={props.history}
                                match={props.match}
                            />
                        );
                    case 'Form':
                        return (
                            <Form
                                pageKey={props.pageKey}
                                formKey={c.key}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...meta.style}}
                                key={c.key}
                                items={c.items}
                                meta={meta}
                                forceUpdate={forceUpdate}
                                history={props.history}
                                match={props.match}
                            />
                        )
                    case 'Stack':
                        return (
                            <Stack 
                                key={c.key}
                                pageKey={props.pageKey}
                                stackKey={c.key}
                                items={c.items}
                                direction={meta.direction}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...meta.style}}
                                history={props.history}
                                match={props.match}
                            />
                        )
                    case 'Button':
                        return (
                            <Button
                                key={c.key}
                                pageKey={props.pageKey}
                                buttonKey={c.key}
                                meta={meta}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...meta.style}}
                                forceUpdate={forceUpdate}
                                history = {props.history}
                                match={props.match}
                            />
                        )
                    case 'Modal': 
                        return (
                            <Modal
                                key={c.key}
                                pageKey={props.pageKey}
                                modalKey={c.key}
                                contents={c.items}
                                title={meta.label}
                                width={meta.width}
                                forceUpdate={forceUpdate}
                                style={meta.style}
                                history={props.history}
                                match={props.match}
                            />
                        )
                    case 'Tabs': 
                        return (
                            <Tabs
                                key={c.key}
                                pageKey={props.pageKey}
                                tabsKey={c.key}
                                items={c.items}
                                style={meta.style}
                                history={props.history}
                                match={props.match}
                            />
                        )
                    case 'Panel':
                        return (
                            <Panel
                                key={c.key}
                                pageKey={props.pageKey}
                                panelKey={c.key}
                                items={c.items}
                                style={meta.style}
                                history={props.history}
                                match={props.match}
                                forceUpdate={forceUpdate}
                                meta={meta}
                            />
                        )
                    case 'Checkbox':
                        return (
                            <Checkbox
                                key={c.key}
                                pageKey={props.pageKey}
                                checkboxKey={c.key}
                                meta={meta}
                                style={{...(vertical ? {marginBottom: 20} : {marginRight: 10}), ...meta.style}}
                                forceUpdate={forceUpdate}
                            />
                        )
                    case 'Iframe':
                        return (
                            <Iframe
                                key={c.key}
                                pageKey={props.pageKey}
                                iframeKey={c.key}
                                style={meta.style}
                                meta={meta}
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