import React from 'react';
import Links from './Links';
import { useAuth } from '../hooks/auth.hook';
import { useSelector, useDispatch } from 'react-redux';

export default function Navbar() {
	const dispatch = useDispatch()
	const { token } = useAuth(dispatch);
	const { name, balance, stateToken } = useSelector(state => {
		if (state.info) {
			return { 
				name: state.info.name || '',
				balance: state.info.balance || 0,
				stateToken: state.token,
			};				
		} else {
			return { 
				name: '',
				balance: 0,
				stateToken: state.token,
			};
		}

	});
	const hasToken = token || stateToken;

	return(<div className='navbar-fixed'>
		<nav className='nav-wrapper grey darken-1'>
			{
				hasToken && name && balance ?
				<div className='nav-info-block'>
					{name}: {balance}
				</div> : ''
			}
			<div className='container'>
				<Links />
			</div>
		</nav>
		</div>
	);
};