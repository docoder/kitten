import React from 'react';
import {SyncHook, Hook} from 'tapable';
import Plugin from '../plugins';
import { debugHooks } from './debug-hooks';

interface PageSectionFilterMeta {
    filter: string
}
interface PageSectionFetchMeta {
    url: string
    method?: string
    data?: {[x:string]: any}[]
}
export interface PageSectionItem {
    key: string
    label: string
    id?: boolean
    type?: string
    meta?: PageSectionFetchMeta
}
export type PageSectionMeta = PageSectionFilterMeta | PageSectionFetchMeta
export interface PageSection {
    type: string
    key: string
    items: PageSectionItem[]
    meta: PageSectionMeta
}
export interface MenuItem {
    key: string;
    label: string;
    pageJSON?: PageSection[];
    index?: boolean;
    params?: string[];
}
export interface MenuGroup {
    label: string;
    subs: MenuItem[];
}
export function isMenuGroup (item: MenuItem | MenuGroup): item is MenuGroup {
    if ((item as MenuGroup).subs) {
        return true
    }
    return false
}

export interface ConfigType {
    appKey: string;
    appTitle: string;
    menus: (MenuGroup | MenuItem) [];
    pageAPI?: string;
    loginUrl?: string;
}
export interface AppHooks {
    afterMenusFetched: Hook;
    afterPageLoaded: Hook;
    afterPageUnloaded: Hook;
    afterComponentLoaded: Hook;
    afterComponentUnloaded: Hook;
    afterFormSelectFetched: Hook;
    afterTableDataSourceFetched: Hook;
    beforeFormSelectFetched: Hook;
    beforeTableDataSourceFetched: Hook;
    beforeTableColumnFinalization: Hook;
}
interface AppType {
    config: ConfigType;
    hooks: AppHooks;
}
class HooksProvider {
    hooks: AppHooks;
    constructor(plugins: Plugin[], logHooks?: string[]) {
        this.hooks = {
            afterMenusFetched: new SyncHook(['appKey', 'menus']),
            afterPageLoaded: new SyncHook(['appKey', 'pageKey', 'props']),
            afterPageUnloaded: new SyncHook(['appKey', 'pageKey', 'props']),
            afterComponentLoaded: new SyncHook([
                'appKey',
                'pageKey',
                'compnent',
                'props',
            ]),
            afterComponentUnloaded: new SyncHook([
                'appKey',
                'pageKey',
                'compnent',
                'props',
            ]),
            afterFormSelectFetched: new SyncHook([
                'appKey',
                'pageKey',
                'formKey',
                'formItems',
                'selectKey',
                'selectData',
            ]),
            afterTableDataSourceFetched: new SyncHook([
                'appKey',
                'pageKey',
                'tableKey',
                'column',
                'dataSource',
            ]),
            beforeFormSelectFetched: new SyncHook([
                'appKey',
                'pageKey',
                'formKey',
                'formItems',
                'selectKey',
            ]),
            beforeTableDataSourceFetched: new SyncHook([
                'appKey',
                'pageKey',
                'tableKey',
                'columns',
            ]),
            beforeTableColumnFinalization: new SyncHook([
                'appKey',
                'pageKey',
                'column',
            ]),
        };
        if (Array.isArray(plugins)) {
            plugins.forEach(plugin => {
                if (logHooks && logHooks.length > 0) {
                    plugin.apply(debugHooks(this.hooks, logHooks))
                }else {
                    plugin.apply(this.hooks)
                }
            });
        }
    }
}
const initialConfig = {
    appKey: 'YOUR_APP_KEY',
    appTitle: 'YOUR_APP_TITLE',
    menus: []
}
const common = {config: initialConfig, hooks: new HooksProvider([]).hooks};
export const App = React.createContext<AppType>(common);
interface IProps {
    config: ConfigType,
    plugins: Plugin[],
    debugHooks?: string[],
    children: React.ReactNode
}
export function AppProvider(props: IProps) {
    return <App.Provider value={{config: props.config, hooks: new HooksProvider(props.plugins, props.debugHooks).hooks}}>{props.children}</App.Provider>;
}
