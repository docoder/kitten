import React from 'react'
import { UIType, ConfigType } from '../../app'
import { Plugin } from '../../plugins'
import { Pages } from '../'
import { Page } from './page'

interface IProps {
    title: string,
    ui: UIType,
    config: ConfigType
    plugins: Plugin[]
    debugHooks?: string[]
    pageKey: string;
    history: any;
    match: any;
    pageJSON: any[];
}

export type EntryProps = IProps
function _Entry(props: EntryProps):JSX.Element {
    const { pageKey } = props;
    let pageAPI = undefined;
    if (props.config) {
        pageAPI = props.config.pageAPI
    }
    return (
        <Pages.Provider>
            <Page pageKey={pageKey} pageAPI={pageAPI} pageJSON={props.pageJSON} history={props.history} match={props.match} />
        </Pages.Provider>
    );
};

export const Entry = React.memo(_Entry)