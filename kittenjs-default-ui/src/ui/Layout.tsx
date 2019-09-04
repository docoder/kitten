import React from 'react';
import {NavFrame} from 'ant-colony-ui';
import { Entry, MenuItem, MenuGroup, isMenuGroup } from 'kittenjs'
import { connectRoute } from '../utils/connectRoute';
interface PageLink {
    page: any;
    label: string;
    link: string;
    index: boolean;
}
export function Layout(
    props: {[x: string]: any},
) {
    // console.log('===LAYOUT-PROPS===:', props)
    const config = props.config;
    const menus = config.menus;
    let pageLinks: PageLink[] = [];
    const getPageLink = (item: MenuItem) => {
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
        };
    };

    menus.forEach((m: MenuItem | MenuGroup) => {
        if (isMenuGroup(m)) {
            m.subs.forEach(s => {
                if (isMenuGroup(s)) {
                    s.subs.forEach(ss => {
                        if (ss.key) {
                            pageLinks.push(getPageLink(ss));
                        } else {
                            throw new Error('Menus Json 不合法，缺少字段 key');
                        }
                    });
                } else if (s.key) {
                    pageLinks.push(getPageLink(s));
                } else {
                    throw new Error('Menus Json 不合法，缺少字段 key');
                }
            });
        } else if (m.key) {
            pageLinks.push(getPageLink(m));
        } else {
            throw new Error('Menus Json 不合法，缺少字段 key 或 subs');
        }
    });
    return (
        <NavFrame
            title={config.appTitle}
            collapsedTitle={config.appKey}
            menus={menus}
            pageLinks={pageLinks}
            logout={() => {}}
        />
    )
}