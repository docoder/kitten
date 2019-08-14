import React from 'react'
export function useModal() {
    const [_modalShow, _setModalShow] = React.useState<{[x: string]: boolean}>({})
    const isShowModal = (pageKey: string, modalKey: string) => {
        const f = _modalShow[`${pageKey}_${modalKey}`]
        return f;
    }
    const hideModal = (pageKey: string, modalKey: string) => {
        _setModalShow({
            ..._modalShow,
            [`${pageKey}_${modalKey}`]: false
        })
    }
    const showModal = (pageKey: string, modalKey: string) => {
        _setModalShow({
            ..._modalShow,
            [`${pageKey}_${modalKey}`]: true
        })
    }
    return { isShowModal, hideModal, showModal }
}