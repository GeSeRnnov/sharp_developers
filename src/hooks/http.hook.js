import { useState, useCallback } from 'react';

export const useHttp = () => {
	const [loading, setLoading] = useState(false);
	const [resStatus, setResStatus] = useState();

	const request = useCallback( async (url, method = 'GET', body = null, headers = {}) => {
		setLoading(true)
		let response = null;
		const jsonType = 'application/json';
		try {
			if (body) {
				body = JSON.stringify(body);
				headers['Content-type'] = jsonType;
			}
			const baseURL = 'http://193.124.114.46:3001';
			const fullURL = baseURL + url;
			response = await fetch(fullURL, {method, body, headers});
			const contentType = response.headers.get('Content-type');
			let data = '';
			if (contentType && contentType.indexOf(jsonType) !== -1){
				data = await response.json();
				setResStatus(response.ok);
			} else {
				data = await response.text();
				setResStatus(response.ok);
				if (!response.ok) {
					throw new Error(data);
				}
			}			
			setLoading(false);
			return data;

		} catch(e) {
			setLoading(false)
			response && setResStatus(response.ok);
			throw e;
		}
	}, [])

	return { loading, request, resStatus }
}