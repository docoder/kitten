import React from 'react';
import {SyncHook, Hook} from 'tapable';
import { Plugin } from '../plugins';
import { debugHooks } from './debug-hooks';

interface UI {
    Alert: any
    Button: any
    Form: any
    Loading: any
    Modal: any
    Page: any
    Table: any
    Layout: any
    Checkbox: any
}
export type UIType = UI | null

interface FilterMeta {
    filter: string
}
interface RefDataMeta {
    ref: string,
    refData?: {[x:string]: {[x:string]: any}[]}
}
interface DataMeta {
    data: {[x:string]: any}[] | string
    pageSize?: number
}
interface FetchMeta {
    url: string
    method?: string
    alias?: {[x:string]: string}
}
export interface ActionMeta {
    label: string
    modal?: string
    link?: string
    url?: string
    params?: {[x:string]: any}
    method?: string
    confirm?: boolean
    confirmLabel?:string
    form?: string
    rowAction?: string
    componentKey?: string
}
interface LayoutMeta {
    direction?: string
    width?: number
    columnsCount?: number
    rowColCounts?: number []
    disableGroupCol?: boolean
    accessories?: PageSection []
}
export type Meta = FilterMeta | FetchMeta | ActionMeta | LayoutMeta | DataMeta | RefDataMeta

export interface TableAction {
    key: string
    meta: ActionMeta
}
export interface PageSectionItem {
    key: string
    label: string
    id?: boolean
    type?: string
    meta?: FetchMeta
    actions?: TableAction[]
    editable?: boolean
    required?: boolean
    reg?: {pattern: string, message: string}
    value?: string
}
export interface PageSection {
    type: string
    key: string
    alias?: string
    actionDisabled?: boolean
    items?: (PageSectionItem | PageSection)[]
    meta?: Meta
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

    beforeFormSelectFetched: Hook;
    afterFormSelectFetched: Hook;

    beforeTableDataSourceFetched: Hook;
    afterTableDataSourceFetched: Hook;

    beforeFormItemsFinalization: Hook;
    beforeTableColumnFinalization: Hook;

    beforeButtonClick: Hook;
    beforeFormSubmit: Hook;
    beforeCheckboxChange: Hook;

    afterTableCellChanged: Hook;
}
interface AppType {
    ui: UIType
    config: ConfigType
    hooks: AppHooks
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
                'component',
                'componetKey',
                'props',
            ]),
            afterComponentUnloaded: new SyncHook([
                'appKey',
                'pageKey',
                'compnent',
                'componetKey',
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

            beforeFormItemsFinalization: new SyncHook(['appKey', 'pageKey', 'formKey', 'items']),
            beforeTableColumnFinalization: new SyncHook([
                'appKey',
                'pageKey',
                'tableKey',
                'column',
            ]),
            
            beforeButtonClick: new SyncHook(['appKey', 'pageKey', 'buttonKey']),
            beforeFormSubmit: new SyncHook(['appKey', 'pageKey', 'formKey', 'values']),
            beforeCheckboxChange: new SyncHook(['appKey', 'pageKey', 'checkbokKey', 'value']),
            afterTableCellChanged: new SyncHook(['appKey', 'pageKey', 'tableKey', 'datasource', 'row'])
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
const common = {ui: null, config: initialConfig, hooks: new HooksProvider([]).hooks};
export const App = React.createContext<AppType>(common);
interface IProps {
    ui: UIType
    config: ConfigType
    plugins: Plugin[]
    debugHooks?: string[]
    children: React.ReactNode
}
export function AppProvider(props: IProps) {
    return <App.Provider value={{ui:props.ui, config: props.config, hooks: new HooksProvider(props.plugins, props.debugHooks).hooks}}>{props.children}</App.Provider>;
}
