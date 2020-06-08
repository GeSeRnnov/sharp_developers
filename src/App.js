import React from 'react';
import './App.scss';
import Balance from './pages/Balance'
import Authorization from './pages/Authorization'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useAuth } from './hooks/auth.hook';
import Navbar from './components/Navbar';
import { useSelector, useDispatch } from 'react-redux';


export default function Router() {
	const dispatch = useDispatch()
	const stateToken = useSelector(state=>state.token);
	const { token } = useAuth(dispatch);
	const hasToken = token || stateToken;


	return <BrowserRouter>
		<Navbar />
		<Switch>
			<Route exact path="/" component={Authorization} />
			<Route path="/balance" component={hasToken && Balance} />
		</Switch>
	</BrowserRouter>
};
