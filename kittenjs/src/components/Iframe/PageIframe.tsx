import React from 'react'

interface IProps {
    url: string
    offset?: number
}

function _PageIframe (props: IProps): JSX.Element {
    const offset = props.offset || 0
    const [height, setHeight] = React.useState<string>((window.innerHeight - offset)+'px')
    React.useEffect(() => {
        const resizeListener = (e: any) => {
            setHeight((e.target.innerHeight - offset) + 'px')
        }
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    })
    
    return (
        <iframe
            style={{
                height, 
                overflow:'visible',
                margin: '-20px',
                marginTop: '-18px'
            }}
            src={props.url}
            frameBorder="0"
        />
    )
}

export const PageIframe = _PageIframe