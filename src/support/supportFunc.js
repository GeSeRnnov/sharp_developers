export const checkForm = (authParams, isRegistration) => {
	const { username, email, password, confirmPassword } = authParams;
	let errUserName = false;
	let	errEmail = false;
	let	errPassword = false;
	if(isRegistration) {
		if(!username || username.length < 4 ) errUserName = true;
		if(!email) errEmail = true;
		if(!password || password !== confirmPassword ) errPassword = true;
	} else {
		if(!password) errPassword = true;
		if(!email) errEmail = true;
	}

	return { errUserName, errEmail, errPassword };
}

export const checkTransactionForm = (authParams) => {
	const { amount, name } = authParams;
	let errAmount = false;
	let	errName = false;
	if(isNaN(Number(amount)) || amount < 0 ) errAmount = true;
	if(!name) errName = true;
	return { errAmount, errName };
}
