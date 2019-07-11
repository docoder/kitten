import React from 'react'
import Index from './pages/Common'
import Entry, { EntryProps, isEntryPropsWithAPI } from './pages/Common/entry'
import { ConfigType, MenuItem, MenuGroup, isMenuGroup, AppHooks } from './app'
import { AppProps } from './components/App'
import { TableColumn } from './components/Table'
import { FormItem } from './components/Form'
import Plugin from './plugins'

class Kitten {
    config: ConfigType
    plugins: Plugin[]
    debugHooks?: string[]
    constructor(config: ConfigType, plugins: Plugin[], debugHooks?: string[]) {
        this.config = config
        this.plugins = plugins
        this.debugHooks = debugHooks
    }
    render(renderer: {render: Function}, dom: HTMLElement) {
        renderer.render(
            <Index config={this.config} plugins={this.plugins} debugHooks={this.debugHooks} />,
            dom,
            () => {
            },
        )
    }
}
export {
    Kitten as default,
    Entry,
    Plugin,
    AppHooks,
    ConfigType,

    MenuItem, 
    MenuGroup, 
    isMenuGroup,

    AppProps,
    EntryProps,
    isEntryPropsWithAPI,
    
    TableColumn,
    FormItem
}