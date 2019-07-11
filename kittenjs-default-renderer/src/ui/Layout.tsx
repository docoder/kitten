import React from 'react';
import ReactDOM from 'react-dom';
import ReactCommon from '../index';
import {Frame} from 'ant-colony-ui';
import {
    Router,
    Route,
    Redirect,
} from 'react-router-dom';
import { Entry, MenuItem, MenuGroup, isMenuGroup } from 'kittenjs'
import connectRoute from '../utils/connectRoute';
import { createBrowserHistory } from "history";
interface PageLink {
    page: any;
    label: string;
    link: string;
    index: boolean;
}
const history = createBrowserHistory()
export default function _Layout(
    dom: HTMLElement,
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
    const renderRoutes = (pls: PageLink[]) => {
        return pls.map(p => {
            let exact = false;
            let redirect = false;
            if (p.link === '/') exact = true;
            if (p.link !== '/' && p.index) redirect = true
            if (typeof p.page === 'function' && p.page.name !== 'ConnectRoute') {
                if (redirect) {
                    return (<React.Fragment key={p.link}>
                        <Route exact path="/" render={() => <Redirect to={p.link} />} />
                        <Route exact={exact} path={p.link} render={p.page} />
                    </React.Fragment>)
                }else {
                    return <Route key={p.link} exact={exact} path={p.link} render={p.page} />
                }
            } else {
                if (redirect) {
                    return (<React.Fragment key={p.link}>
                        <Route exact path="/" component={() => <Redirect to={p.link} />} />
                        <Route exact={exact} path={p.link} component={p.page} />
                    </React.Fragment>)
                }else {
                    return <Route key={p.link} exact={exact} path={p.link} component={p.page} />
                }
            }
        })
    }
    ReactDOM.render(
        <Frame
            title={config.appTitle}
            collapsedTitle={config.appKey}
            menus={menus}
            didMount={(node: HTMLElement) => {
                ReactCommon.render(
                    <Router history={history}>
                            {renderRoutes(pageLinks)}
                    </Router>,
                    node, ()=>{})
            }}
            onMenuSelect={(key: string) => {
                history.push(key)
            }}
        />,
        dom,
        ()=> {}
    );
}
