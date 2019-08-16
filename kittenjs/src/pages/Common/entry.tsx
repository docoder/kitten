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
}
interface IPropsWithAPI extends IProps {
    pageAPI: string;
}
interface IPropsWithJSON extends IProps {
    pageJSON: any[];
}
export function isEntryPropsWithAPI (item: IPropsWithAPI | IPropsWithJSON): item is IPropsWithAPI {
    if ((item as IPropsWithAPI).pageAPI) {
        return true
    }
    return false
}
export type EntryProps = IPropsWithAPI | IPropsWithJSON
function _Entry(props: EntryProps):JSX.Element {
    const { pageKey } = props;
    let pageAPI = undefined;
    let pageJSON = undefined;
    if (isEntryPropsWithAPI(props)) {
        pageAPI = props.pageAPI
    }else {
        pageJSON = props.pageJSON
    }
    return (
        <Pages.Provider>
            <Page pageKey={pageKey} pageAPI={pageAPI} pageJSON={pageJSON} />
        </Pages.Provider>
    );
};

export const Entry = React.memo(_Entry)