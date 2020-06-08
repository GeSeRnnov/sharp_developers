import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function ExpansionPanelWrapper(props) {
	const id = props.id;
	const ariaControls = `${id}-content`;
	const fullId = `${id}-header`;

	const togglePanel = (event, isExpanded) => {
		const expandFunc = props.expandFunc;
		if (expandFunc) expandFunc();
	}

	return (
		<ExpansionPanel onChange={togglePanel}>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={ariaControls}
				id={fullId}				
			>
				<Typography>{props.title}</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				{props.children}
			</ExpansionPanelDetails>
		</ExpansionPanel>
	)
};

ExpansionPanelWrapper.propTypes = {
	id: PropTypes.string,
}

ExpansionPanelWrapper.defaultValues ={
	id: '',
}
