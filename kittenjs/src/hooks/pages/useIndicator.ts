import React from "react";
export type Error = {
	code: number;
	message: string;
} | null;
export type Message = {
	title?: string;
	message: string;
} | null;
export default function useIndicator() {
	const [error, setError] = React.useState<Error>(null);
	const [warning, setWarning] = React.useState<Message>(null);
	const [success, _setSuccess] = React.useState<Message>(null);
	const [info, _setInfo] = React.useState<Message>(null);
	const [requestQuantity, _setRequestQuantity] = React.useState(0);
	const clearSuccess = () => _setSuccess(null);
	const clearInfo = () => _setInfo(null);
	const clearWarning = () => setWarning(null);
    const clearError = () => setError(null);
    const clearRequest = () => _setRequestQuantity(0);
	const setSuccess = (message: Message) => {
		_setSuccess(message);
		setTimeout(() => {
			clearSuccess();
		}, 3000);
	};
	const setInfo = (message: Message) => {
		_setInfo(message);
		setTimeout(() => {
			clearInfo();
		}, 3000);
	};
	const startRequest = () => {
		_setRequestQuantity(requestQuantity + 1)
	}
	const endRequest = () => {
		_setRequestQuantity(requestQuantity - 1)
	}
	return {
		error,
		warning,
		success,
		info,
		requestQuantity,
		setError,
		setWarning,
		setSuccess,
		setInfo,
		clearError,
		clearInfo,
		clearSuccess,
		clearWarning,
		startRequest,
		endRequest,
        clearRequest
	};
}