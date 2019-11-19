import React from 'react';
import {NewFrame} from 'ant-colony-ui';
// import NewFrame from './NewFrame';
import { Entry, MenuItem, MenuGroup, isMenuGroup } from 'kittenjs'
import { connectRoute } from '../utils/connectRoute';
interface PageLink {
    page: any;
    label: string;
    link: string;
}
export function Layout(
    props: {[x: string]: any},
) {
    // console.log('===LAYOUT-PROPS===:', props)
    const config = props.config;
    const menus = config.menus;
    let pageLinks: PageLink[] = [];
    const getPageLink = (item: MenuItem, exact: boolean = true) => {
        const EntryComponent = connectRoute(Entry, `${item.label} | ${config.appTitle}`);
        return {
            page: (ps: {location: string, [x: string]: any}) => {
                return (
                    <EntryComponent
                        {...props}
                        {...ps}
                        title={item.label}
                        pageKey={item.key}
                        pageJSON={item.pageJSON}
                    />
                )
            },
            label: item.label,
            link: item.params
                ? `/${item.key}/:${item.params.join(':')}`
                : `/${item.key}`,
            index: !!item.index,
            exact: exact
        };
    };
    const handleSubPages = (m: MenuItem, path: string) => {
        if (m.subPages) {
            m.subPages.forEach( sp => {
                const newPath = `${path}/${sp.key}`;
                pageLinks.push(getPageLink({...sp, key: newPath}, sp.subPages ? true:false));
                handleSubPages(sp, newPath)
            })
        }else {
            return
        }
    }
    menus.forEach((m: MenuItem | MenuGroup) => {
        if (isMenuGroup(m)) {
            m.subs.forEach(s => {
                if (isMenuGroup(s)) {
                    s.subs.forEach(ss => {
                        if (ss.key) {
                            pageLinks.push(getPageLink(ss));
                            handleSubPages(ss, ss.key); 
                        } else {
                            throw new Error('Menus Json 不合法，缺少字段 key');
                        }
                    });
                } else if (s.key) {
                    pageLinks.push(getPageLink(s));
                    handleSubPages(s, s.key); 
                } else {
                    throw new Error('Menus Json 不合法，缺少字段 key');
                }
            });
        } else if (m.key) {
            pageLinks.push(getPageLink(m));
            handleSubPages(m, m.key);
        } else {
            throw new Error('Menus Json 不合法，缺少字段 key 或 subs');
        }
    });
    return (
        <NewFrame
            title={config.appTitle}
            collapsedTitle={config.appKey}
            menus={menus}
            pageLinks={pageLinks}
            logout={config.logoutBtnCallback}
            renderHeaderActions={props.renderHeaderActions}
            renderRoutes={props.renderRoutes}
            renderSiderTopSection={props.renderSiderTopSection}
        />
    )
}
