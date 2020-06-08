import React, { Component } from 'react';
import PropTypes from 'prop-types';

const classes = {
	overlay: {
		background: '#0000007a',
	    width: '100%',
	    height: '100vh',
	    position: 'fixed',
	    top: '0',
	    left: '0',
	    zIndex: '50',
	},
	modal: {
		background: 'white',
	    width: '30%',
	    minHeight: '300px',
	    position: 'fixed',
	    top: '20%',
	    left: '35%',
	    zIndex: '100',
	    display: 'flex',
	    borderRadius: '2px',
	},
	removeModal: {
	    minHeight: '0px',
	}
};

export default class Modal extends Component {

  	render(){
  		const {
  			removeModal,
  		} = this.props;
  		const removeModalStyle = Object.assign({}, classes.modal, classes.removeModal);

		return (
			<div style={classes.overlay}>
				<div 
					style={removeModal ? removeModalStyle : classes.modal}
				>
					{this.props.children}
				</div>
			</div>
		)
	}	
};

Modal.propTypes = {
	removeModal: PropTypes.bool,
}