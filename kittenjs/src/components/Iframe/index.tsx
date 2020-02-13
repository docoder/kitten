import React from 'react';
import { PageIframe } from './PageIframe'
interface IProps {
    style?: React.CSSProperties;
    pageKey: string;
    meta: {[x:string]: any};
    iframeKey: string;
}

function _Iframe (props: IProps): JSX.Element {
    return (
        props.meta && props.meta.block ? 
        <iframe
            style={{width: '100%', ...props.style}}
            src={props.meta.href}
            frameBorder="0"
        />
        :
        <PageIframe
            url={props.meta.href}
            offset={props.meta.offset ? parseInt(props.meta.offset) : 62}
        />
    )
}

export const Iframe = _Iframe