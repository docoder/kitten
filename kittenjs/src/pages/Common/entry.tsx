import React from 'react'
import { UIType, ConfigType } from '../../app'
import { Plugin } from '../../plugins'
import { Pages } from '../'
import { Page } from './page'

interface IProps {
    title?: string,
    ui?: UIType,
    pageKey: string;
    history?: any;
    match?: any;
    pageAPI?: string;
    pageJSON: any[];
}

export type EntryProps = IProps
function _Entry(props: EntryProps):JSX.Element {
    return (
        <Pages.Provider>
            <Page pageKey={props.pageKey} pageAPI={props.pageAPI} pageJSON={props.pageJSON} history={props.history} match={props.match} />
        </Pages.Provider>
    );
};

export const Entry = React.memo(_Entry)