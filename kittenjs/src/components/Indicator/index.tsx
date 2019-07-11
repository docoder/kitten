import React from 'react'
import Pages from '../../pages'
import Alert from '../Alert'
import Loading from '../Loading'
export default function Indicator(): JSX.Element {
    
    const {
        error,
        warning,
        success,
        info,
        requestQuantity,
        clearError,
        clearInfo,
        clearSuccess,
        clearWarning,
        clearRequest
    } = Pages.useContainer()
    const errorAlert = error && (
        <Alert
            type="error"
            message={error.code ? '操作失败' : '发生错误'}
            description={error.message || JSON.stringify(error)}
            onClose={clearError}
        />
    );
    const warningAlert = warning && (
        <Alert
            type="warning"
            message={warning.title}
            description={warning.message}
            onClose={clearWarning}
        />
    );
    const infoAlert = info && (
        <Alert
            type="info"
            message={info.title}
            description={info.message}
            onClose={clearInfo}
        />
    );
    const successAlert = success && (
        <Alert
            type="success"
            message={success.title}
            description={success.message}
            onClose={clearSuccess}
        />
    );
    return (
        <>
            { errorAlert }
            { warningAlert }
            { infoAlert }
            { successAlert }
            <Loading show={requestQuantity > 0} type="overall" timeout={clearRequest} />
        </>
    )
}