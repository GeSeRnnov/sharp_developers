import { useState, useCallback, useEffect } from 'react';

export const useAuth = (dispatch = null) => {
	const [savedToken, setSavedToken] = useState(null)
	// const [userData, setUserData] = useState(null)
	
	const login = useCallback((token) => {
		setSavedToken(token);
		dispatch({ type: 'setToken', token });
		if(token) saveLocalData({ token });
	}, []);

	const logout = useCallback(()=> {
		setSavedToken(null);
		dispatch({ type: 'setToken', token: '' });
		localStorage.removeItem('PWData');
	}, []);

	const getLocalData = useCallback(() => {
		const storedUserData = localStorage.getItem('PWData');
		return storedUserData && JSON.parse(storedUserData);
	}, []);

	const saveLocalData = useCallback((data)=>{
		const userData = getLocalData();
		const newData = userData ? {...userData, ...data} : {...data};		
		localStorage.setItem('PWData', JSON.stringify(newData));
	}, []);

	useEffect(() => {
		const userData = getLocalData();
		if (userData && userData.token) login(userData.token);
	}, []);

	return { login, logout, savedToken, getLocalData, saveLocalData };
}
