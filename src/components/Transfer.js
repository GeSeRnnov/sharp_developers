import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../hooks/auth.hook';
import { useHttp } from '../hooks/http.hook';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ExpansionPanelWrapper from './ExpansionPanelWrapper';
import { checkTransactionForm } from '../support/supportFunc';

export default function Tracsfer() {
	const dispatch = useDispatch();
	const [fetchedError, setFetchedError] = useState(false);
	const [fetchedErrorMsg, setFetchedErrorMsg] = useState('');
	const [namesList, setNamesList] = useState([]);
	const { getLocalData } = useAuth(dispatch);
	const { request } = useHttp();
	const { token } = getLocalData();
	const [isAmountDisabed, setIsAmountDisabed] = useState(true);
	const [form, setForm] = useState({ name:'', amount: 0 });
	const [formErrors, setFormErrors] = useState({ 
		errAmount: false, 
		errName: false,
	});
	const repeatData = useSelector(state => state.repeatData);
	
	useEffect(()=>{
		if (repeatData) {
			if(repeatData.username && repeatData.amount) {
				setForm({ name: repeatData.username, amount: repeatData.amount });
			}
		}
	}, [repeatData])

	const searchContact = async (name) => {
		try {
			setFetchedError(false);
			const bearer = `Bearer ${token}`;
			const data = await request(`/api/protected/users/list`, 
				'POST', 
				{ filter: name }, 
				{ 'Authorization': bearer }
			);
			if (data && data.length) {
				const formedNameList = data.map(item => {
					return {...item, title: item.name}
				});
				setNamesList(formedNameList);
			} else {
				setNamesList([]);
			}
			setForm({ ...form, name });
		} catch(e) {
			console.log(e);
			setFetchedError(true);
			setFetchedErrorMsg(e.message);
		}
	};

	const changeContact = name => {
		if(name) {
			setIsAmountDisabed(false);			
			setForm({ ...form, name: name.name || '' });
		} else {
			setForm({ ...form, name: '' });
		}
	}


	const changeAmount = event => {
		const changedFormData = {
			 ...form, 
			 [event.target.name]: event.target.value,
		};
		setForm({ ...changedFormData });
		const { errAmount } = formErrors;
		if (errAmount) {
			setFormErrors(checkTransactionForm(changedFormData));
		}
		setFetchedError(false);
	}

	const onTransact = async dispatch => {
		try {
			const checkedForm = checkTransactionForm(form);
			setFormErrors({...checkedForm});
			const { errAmount, errName } = checkedForm;
			if(!errAmount && !errName ) {
				const bearer = `Bearer ${token}`;
				const data = await request(`/api/protected/transactions`, 
					'POST', 
					{ ...form }, 
					{ 'Authorization': bearer }
				);				
				dispatch({ type: 'addTransfer', transfer: data.trans_token });
			}			
		} catch(e) {
			console.log(e);
			setFetchedError(true);
			setFetchedErrorMsg(e.message);
		}

	}

	return (
		<div className='head'>
			<ExpansionPanelWrapper
				id='panel-transfer'
				title='Make a transfer'
			>
				<Grid container>
					<Grid item xs={6}>
						Recepient:
					</Grid>
					<Grid item xs={6}>
						<Autocomplete
							options={namesList}
							id="clear-on-escape"
							clearOnEscape
							value={form.name || ''}
							onInputChange={(e, val)=>searchContact(val)}
							onChange={(e, val)=>changeContact(val)}
							getOptionLabel={t=>t.name || form.name}
							renderInput={(params) => <TextField {...params} label="Recepient" margin="normal" />}
						/>
						{formErrors.errName ? 
			        		<div className='form-error-block'>
			        			The name must not be an empty.
			        		</div> : ''
			        	} 
						{fetchedError ?
				        	<div className='fetch-error'>
				        		{
				        			fetchedErrorMsg ||
				        			'Sorry, but server is busy now. Try again later.'
				        		}
				        	</div> : ''
				        }
					</Grid>
					<Grid item xs={6}>
						Transaction amount:
					</Grid>
					<Grid item xs={6}>
						<input 
				        	placeholder="Amount" 
				        	id="transaction-amount" 
				        	type="text" 
				        	name="amount"
				        	value={form.amount}
				        	onChange={changeAmount}
				        	disabled={isAmountDisabed}
			        	/>			        	
			        	{formErrors.errAmount ? 
			        		<div className='form-error-block'>
			        			The amount must be a non-zero number.
			        		</div> : ''
			        	} 
					</Grid>
					<Grid item xs={12}>
						<button 
				          	className='btn grey lighten-1 waves-effect waves-light' 
				          	onClick={()=>onTransact(dispatch)}
			          	>
			          		Send
			          	</button>	          	
					</Grid>
				</Grid>
			</ExpansionPanelWrapper>
		</div>
			
	)
};
