import React from 'react'
import { Index } from './pages/Common'
import { Entry, EntryProps } from './pages/Common/entry'
import { AppProvider, UIType, ConfigType, MenuItem, MenuGroup, isMenuGroup, AppHooks, PageSection, PageSectionItem} from './app'
import { AppProps } from './components/Layout'
import { FormItem } from './components/Form'
import { TableColumn } from './components/Table'
import { Plugin } from './plugins'

class Kitten {
    ui: UIType
    config: ConfigType
    plugins: Plugin[]
    debugHooks?: string[]
    constructor(ui: UIType, config: ConfigType, plugins: Plugin[], debugHooks?: string[]) {
        this.ui = ui
        this.config = config
        this.plugins = plugins
        this.debugHooks = debugHooks
    }
    render(renderer: {render: Function}, dom: HTMLElement) {
        renderer.render(
            <AppProvider ui={this.ui} config={this.config} plugins={this.plugins} debugHooks={this.debugHooks}>
                <Index />
            </AppProvider>,
            dom,
            () => {
            },
        )
    }
}
export {
    Kitten,
    Entry,
    AppProvider,
    Plugin,
    AppHooks,
    UIType,
    ConfigType,
    PageSection,
    PageSectionItem,
    
    MenuItem, 
    MenuGroup, 
    isMenuGroup,

    AppProps,
    EntryProps,
    TableColumn,
    FormItem
}