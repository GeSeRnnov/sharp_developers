import React, { useState, useEffect } from 'react';
import Transfer from '../components/Transfer';
import TransactionsHistory from '../components/TransactionsHistory';
import { useAuth } from '../hooks/auth.hook';
import { useHttp } from '../hooks/http.hook';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';

export default function ContactListView () {
	const dispatch = useDispatch();
	const { getLocalData, saveLocalData} = useAuth(dispatch);
	const [fetchedError, setFetchedError] = useState(false);
	const [fetchedErrorMsg, setFetchedErrorMsg] = useState('');
	const { request } = useHttp();
	const { token } = getLocalData();
	const { name, email, balance } = useSelector(state => {
		if (state.info) {
			return { 
				name: state.info.name || '',
				email: state.info.email || '',
				balance: state.info.balance || 0,
			};				
		} else {
			return { 
				name: '',
				email: '',
				balance: 0,
			};
		}

	});
	useEffect(()=>{
		const fetchBalance = async () => {
			try {
				const bearer = `Bearer ${token}`;
				const data = await request(`/api/protected/user-info`, 'GET', null, { 
					'Authorization': bearer 
				});
				if (data && data.user_info_token) {
					saveLocalData(data)
					dispatch({ type: 'setInfo', data });
				}
			} catch(e) {
				console.log(e);
				setFetchedError(true);
				setFetchedErrorMsg(e.message);
			}
		}
		fetchBalance();
	}, [])


	return (<>
			<div className='container'>
				<Grid container className='main-info-block'>
					<Grid item xs={6} className='main-info-col'>
						<span className='main-info-label'>Name:</span>
					</Grid>
					<Grid item xs={6} className='main-info-col'>
						<span className='main-info-value'>{name}</span>
					</Grid>
					<Grid item xs={6} className='main-info-col'>
						<span className='main-info-label'>Email:</span>
					</Grid>
					<Grid item xs={6} className='main-info-col'>
						<span className='main-info-value'>{email}</span>
					</Grid>
					<Grid item xs={6} className='main-info-col'>
						<span className='main-info-label'>Balance:</span>
					</Grid>
					<Grid item xs={6} className='main-info-col'>
						<span className='main-info-value'>{balance}</span>
					</Grid>
				</Grid>

				<Transfer />
				<TransactionsHistory />

				{fetchedError ? 
					<div className='fetch-error'>
		        		{
		        			fetchedErrorMsg ||
		        			'Sorry, but server is busy now. Try again later.'
		        		}
		        	</div> : ''
		        }
			</div>
		</>
	)
};
