import React from 'react'
import { App, TabItem } from '../../app'
import { Stack } from '../Stack'

interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    items: TabItem[];
    tabsKey: string;
    history: any;
    match: any;
}

function _Tabs(props: IProps): JSX.Element {
    const app = React.useContext(App)
    React.useEffect(() => {   
        app.hooks.afterComponentLoaded.call(app.config.appKey, props.pageKey,'Tabs', props.tabsKey, props)
        return () => {
            app.hooks.afterComponentUnloaded.call(app.config.appKey, props.pageKey, 'Tabs', props.tabsKey, props)
        }
    }, [])
    const Tabs = app.ui? app.ui.Tabs : null
    const TabPanel = Tabs.Panel;
    let defaultTab = props.items.find((i:TabItem) => i.default)
    if (!defaultTab && props.items.length > 0) {
        defaultTab = props.items[0]
    }
    
    return (
        <Tabs
            defaultActiveKey={defaultTab ? defaultTab.key : undefined}
            onChange={(key: string) => {
                app.hooks.onTabChange.call(app.config.appKey, props.pageKey, props.tabsKey, key, props)
            }}
        >
            {props.items.map((i: TabItem) => {
                return (
                    <TabPanel tab={i.label} panelKey={i.key} key={i.key}>
                        <Stack 
                            pageKey={props.pageKey} 
                            items={i.items || []} 
                            direction="vertical" 
                            stackKey={`${props.pageKey}_${props.tabsKey}_${i.key}_main_stack`} 
                            history={props.history}
                            match={props.match}
                        />
                    </TabPanel>
                )
            })}
        </Tabs>
    )
}

export const Tabs = React.memo(_Tabs)