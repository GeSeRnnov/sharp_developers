import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hook';
import { useSelector, useDispatch } from 'react-redux';

export default function Links(props) {
	const dispatch = useDispatch()
	const stateToken = useSelector(state=>state.token);
	const { token , logout } = useAuth(dispatch);
	const hasToken = token || stateToken;

	return(
		<ul className='right'>
			{ hasToken ?
				<>
					<li>
						<NavLink to='/contacts'>Balance</NavLink>
					</li>
					<li><NavLink to='/' onClick={()=>logout()}>Logout</NavLink></li>
				</>
				:
				<>
					<li>
						<span className="grey-text text-darken-4">Balance</span>
					</li>
					<li><NavLink to='/'>Login</NavLink></li>
				</>
			}
		</ul>
	);
};