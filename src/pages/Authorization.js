import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useAuth } from '../hooks/auth.hook';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkForm } from '../support/supportFunc';

export default function ContactListView () {
	const dispatch = useDispatch();
	const history = useHistory();
	const { login, getLocalData } = useAuth(dispatch);
	const { loading, request } = useHttp();
	const localData = getLocalData();
	const { token = '' } = localData || {};
	const [form, setForm] = useState({
		username: '',
		email:'',
		password: '',
		confirmPassword: '',
	});
	const [fetchedError, setFetchedError] = useState(false);
	const [fetchedErrorMsg, setFetchedErrorMsg] = useState('');
	const [formErrors, setFormErrors] = useState({
		errUserName: false,
		errEmail: false,
		errPassword: false,
	});
	const { isLoginMode } = useSelector(state => {
		return {
			isLoginMode: state.isLoginMode,
		}
	});

	useEffect(()=>{
		if (token) history.push('/balance');
	}, [token]);

	const changeHandler = event => {
		const changedFormData = {
			 ...form, 
			 [event.target.name]: event.target.value,
		};
		setForm({ ...changedFormData });
		const {errUserName,
			errEmail,
			errPassword 
		} = formErrors;
		if (errUserName || errEmail || errPassword) {
			setFormErrors(checkForm(changedFormData, !isLoginMode));
		}
		setFetchedError(false);
	}

	const toggleAuth = (dispatch) => {
		setForm({
			username: '',
			email:'',
			password: '',
			confirmPassword: '',
		});
		dispatch({type: 'toggleLoginMode'});
		setFetchedError(false);
	}

	const onLogin = async () => {
		const checkedForm = checkForm(form, false);
		const { errEmail, errPassword } = checkedForm;
		setFormErrors({...checkedForm});
		const { username, confirmPassword, ...registerData } = form;
		try {
			if (!errEmail && !errPassword) {
				const data = await request(`/sessions/create`, 'POST', {...registerData});
				if (data.id_token) login(data.id_token);
				history.push('/balance');
			}
		} catch(e) {
			setFetchedError(true);
			setFetchedErrorMsg(e.message);
		}		
	}

	const onRegistration = async (dispatch) => {
		const checkedForm = checkForm(form, true);
		const { errUserName, 
			errEmail, 
			errPassword,
		} = checkedForm;
		setFormErrors({...checkedForm});
		const { confirmPassword, ...registerData } = form;

		try {
			if (!errUserName && !errEmail && !errPassword) {
				const userToken = await request('/users', 'POST', {...registerData});
				dispatch({ type: 'setToken', token: userToken.id_token });
				window.M.toast({html: 'User created successfully. Please, login now.'});
				setTimeout(()=>{
					dispatch({ type: 'toggleLoginMode' });
				}, 1000)
			}
		} catch(e) {
			setFetchedError(true);
			setFetchedErrorMsg(e.message);
		}		
	}

	return (
		<div id='containerAuth' >
			<div className="col s6 offset-s3">
				<div className='head'>
					{
						isLoginMode ? <>Authorization</> : <>Registration</>
					}
				</div>
				 <div className='content'>
			        <div className='inputs'>
			        	{!loading ? <div>
				        	{!isLoginMode ?
			        			<>
				        			<div className="input-field">
										<input 
								        	placeholder="Name" 
								        	id="username" 
								        	type="text" 
								        	name="username"
								        	value={form.username}
								        	onChange={changeHandler}
							        	/>
						        	</div> 
						        	{formErrors.errUserName ? 
						        		<div className='form-error-block'>
						        			Name length should be more then 2 characters.
						        		</div> : ''
						        	}
					        	</>
					        	: ''
					        }

			        		<div className="input-field">
					        	<input 
						        	placeholder="Email" 
						        	id="email" 
						        	type="text" 
						        	name="email"
						        	value={form.email}
						        	onChange={changeHandler}
					        	/>
					        	{formErrors.errEmail ? 
					        		<div className='form-error-block'>
					        			Invalid email format.
					        		</div> : ''
					        	}
					        </div>

					        <div className="input-field">
					        	<input 
						        	placeholder="Password" 
						        	id="password" 
						        	type="password" 
						        	name="password"
						        	value={form.password}
						        	onChange={changeHandler}
					        	/>
					        	{formErrors.errPassword && isLoginMode ? 
					        		<div className='form-error-block'>
					        			The password shouldn't be empty.
					        		</div> : ''
					        	}
					        </div>

				        	{!isLoginMode ?
								<>
									<div className="input-field">
							        	<input 
								        	placeholder="Confirm password" 
								        	id="confirmPassword" 
								        	type="password" 
								        	name="confirmPassword"
								        	value={form.confirmPassword}
								        	onChange={changeHandler}
							        	/>
							        </div>
							        {formErrors.errPassword ? 
						        		<div className='form-error-block'>
						        			Both passwords must match and shouldn't be empty.
						        		</div> : ''
						        	}
						        </> : ''
					        }	
					        {fetchedError ?
					        	<div className='fetch-error'>
					        		{
					        			fetchedErrorMsg ||
					        			'Sorry, but server is busy now. Try again later.'
					        		}
					        	</div> : ''
					        }			        
			        	</div> : 
			        	<div className='loading'>
			        		Loading...
			        	</div>
			        	}

			        </div>
			        <div className='buttons'>
			          	{isLoginMode ?
			          		<>
				          		<button 
						          	className='btn grey lighten-1 waves-effect waves-light' 
					          		onClick={()=>onLogin(dispatch)}
					          	>
					          		Log in
					          	</button>
					          	<button 
						          	className='btn grey lighten-1 waves-effect waves-light' 
						          	onClick={()=>toggleAuth(dispatch)}
					          	>
					          		Register
					          	</button>
				          	</> :
				          	<>
				          		<button 
						          	className='btn grey lighten-1 waves-effect waves-light' 
						          	onClick={()=>onRegistration(dispatch)}
					          	>
					          		Ok
					          	</button>
					          	<button 
						          	className='btn grey lighten-1 waves-effect waves-light' 
						          	onClick={()=>toggleAuth(dispatch)}
					          	>
					          		Cancel
					          	</button>
				          	</>
				          }
			        </div>
		      </div>
			</div>
		</div>
	)
};
