import React from 'react';
import {SyncHook, SyncWaterfallHook, Hook} from 'tapable';
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
    Tabs: any
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
    pageSize?: number,
    disablePagination?: boolean
}
interface FetchMeta {
    url: string
    method?: string
    alias?: {[x:string]: string}
}
export interface ActionMeta {
    label?: string
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
    show?: string | boolean
}
interface LayoutMeta {
    direction?: string
    width?: number
    columnsCount?: number
    rowColCounts?: number []
    labelPosition?: string
    actionsShow?: boolean
    disableGroupCol?: boolean
    accessories?: PageSection []
    style?: {[x:string]: string}
    submitTitle?: string
    clearTitle?: string
    actionDirection?: string
    clearButtonShow?: boolean
}
interface ItemMeta {
    format?: string
    width?: string
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
    meta?: FetchMeta | ItemMeta
    actions?: TableAction[]
    editable?: boolean
    required?: boolean
    reg?: {pattern: string, message: string}
    value?: string
    disabled?: boolean
    showTime?: boolean
    width?: string
    placeholder?: string
}
export interface PageSection {
    type: string
    key: string
    alias?: string
    actionDisabled?: boolean
    items?: (TabItem | PageSectionItem | PageSection)[]
    meta?: Meta
}
export interface TabItem {
    key: string;
    label: string;
    items: (PageSection)[];
    meta?: ActionMeta;
    default?: boolean;
}
export interface MenuItem {
    key: string;
    label: string;
    pageJSON?: PageSection[];
    index?: boolean;
    params?: string[];
    subPages?: (MenuItem)[];
    subs?: MenuItem[];
}
export interface MenuGroup {
    key?: string
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
    logoutBtnCallback?: Function;
}
export interface AppHooks {
    renderCustomRoutes: Hook;
    // afterMenusFetched: Hook;
    
    afterPageLoaded: Hook;
    afterPageUnloaded: Hook;

    afterComponentLoaded: Hook;
    afterComponentUnloaded: Hook;

    beforeSelectDataFetched: Hook;
    afterSelectDataFetched: Hook;

    beforeTableDataSourceFetched: Hook;
    afterTableDataSourceFetched: Hook;

    beforeFormItemFinalization: Hook;
    beforeFormAllItemsFinalization: Hook;
    beforeTableColumnFinalization: Hook;
    beforeTableAllColumnsFinalization: Hook;

    beforeButtonClick: Hook;
    beforeFormSubmit: Hook;
    beforeCheckboxChange: Hook;

    afterTableCellChanged: Hook;

    onTabChange: Hook;
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
            renderCustomRoutes: new SyncWaterfallHook(['appKey', 'RouteComponents', 'mainRender']),
            // afterMenusFetched: new SyncHook(['appKey', 'menus']),
            afterPageLoaded: new SyncHook(['appKey', 'pageKey', 'props']),
            afterPageUnloaded: new SyncHook(['appKey', 'pageKey', 'props']),
            afterComponentLoaded: new SyncHook([
                'appKey',
                'pageKey',
                'componentType',
                'componetKey',
                'props',
            ]),
            afterComponentUnloaded: new SyncHook([
                'appKey',
                'pageKey',
                'componentType',
                'componetKey',
                'props',
            ]),
            beforeSelectDataFetched: new SyncHook([
                'appKey',
                'pageKey',
                'componentKey',
                'items',
                'selectKey',
            ]),
            afterSelectDataFetched: new SyncHook([
                'appKey',
                'pageKey',
                'componentKey',
                'items',
                'selectKey',
                'selectData',
            ]),
            beforeTableDataSourceFetched: new SyncHook([
                'appKey',
                'pageKey',
                'tableKey',
                'columns',
                'pagination'
            ]),
            afterTableDataSourceFetched: new SyncHook([
                'appKey',
                'pageKey',
                'tableKey',
                'column',
                'dataSource',
                'pagination'
            ]),

            beforeFormItemFinalization: new SyncHook(['appKey', 'pageKey', 'formKey', 'props', 'item']),
            beforeFormAllItemsFinalization: new SyncHook(['appKey', 'pageKey', 'formKey', 'props', 'items']),
            beforeTableColumnFinalization: new SyncHook([
                'appKey',
                'pageKey',
                'tableKey',
                'props', 
                'column',
            ]),
            beforeTableAllColumnsFinalization: new SyncHook([
                'appKey',
                'pageKey',
                'tableKey',
                'props', 
                'columns',
            ]),
            
            beforeButtonClick: new SyncHook(['appKey', 'pageKey', 'buttonKey']),
            beforeFormSubmit: new SyncHook(['appKey', 'pageKey', 'formKey', 'values']),
            beforeCheckboxChange: new SyncHook(['appKey', 'pageKey', 'checkboxKey', 'value']),
            afterTableCellChanged: new SyncHook(['appKey', 'pageKey', 'tableKey', 'dataSource', 'row']),
            onTabChange: new SyncHook(['appKey', 'pageKey', 'tabsKey', 'tabKey', 'props'])
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
