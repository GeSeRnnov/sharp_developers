import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHttp } from '../hooks/http.hook';
import ExpansionPanelWrapper from './ExpansionPanelWrapper';
import MaterialTable from 'material-table';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

export default function ContactListView() {
	const dispatch = useDispatch();
	const [history, setHistory] = useState();
	const { request } = useHttp();
	const { transHistory, token } = useSelector(state => {
		return {
			transHistory: state.transHistory,
			token: state.token,
		}
	})

	const togglePanel = async (dispatch) => {
		if (!transHistory.length) {
			const bearer = `Bearer ${token}`;
			const data = await request(`/api/protected/transactions`, 
				'GET', 
				null, 
				{ 'Authorization': bearer }
			);
			if(data.trans_token) {
				dispatch({ type: 'setTransactionsHistory', history: data.trans_token });
				setHistory(data.trans_token);
			}
		}
	}

	return (
		<div className='head'>
			<ExpansionPanelWrapper
				id='panel-transferHistory'
				title='Transfers history'
				expandFunc={()=>togglePanel(dispatch)}
			>
				<MaterialTable
					title="Your transfers"
					columns={[
						{ title: 'Date/Time', field: 'date', sorting: true },
						{ title: 'Correspondent', field: 'username', sorting: true },
						{ title: 'Amount', field: 'amount', type: 'numeric', sorting: true },
						{ title: 'Balance', field: 'balance', sorting: false },
					]}
					data={history}        
					actions={[
						{
							icon: () => <PlayArrowIcon/>,
							tooltip: 'Repeat transfer',
							onClick: (event, rowData) => dispatch({ type: 'repeatTransfer', data: rowData })
						}
					]}
					style={{width: '100%'}}
				/>
			</ExpansionPanelWrapper>
		</div>
	)
};

