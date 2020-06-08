const initialState = { 
	repeatData: {},
	transHistory: [],
	sessionTransfers: [],
	lastTransfer: {},
	token: '',
	info: {},
	isLoginMode: true,
};

export default function(state = initialState, action) {
	const clone = Object.assign({}, state);
	switch (action.type) {
		case 'repeatTransfer':
			const data = action.data;
			clone.repeatData = data;
			return clone;
		case 'setTransactionsHistory':
			const history = action.history;
			clone.transHistory = history;
			return clone;
		case 'addTransfer':
			const transfer = action.transfer;
			const newBalance = clone.info.balance + transfer.amount;
			const newSessionTransfers = clone.sessionTransfers;
			newSessionTransfers.push(transfer);
			clone.sessionTransfers = newSessionTransfers;
			clone.lastTransfer = transfer;
			clone.info.balance = newBalance;
			return clone;
		case 'toggleLoginMode':
			const changedMode = !clone.isLoginMode;
			clone.isLoginMode = changedMode;
			return clone;
		case 'setInfo':
			clone.info = action.data.user_info_token;
			return clone;
		case 'setToken':
			clone.token = action.token;
			return clone;
		default:
			return state;
	}
}