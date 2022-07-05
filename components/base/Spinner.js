import React from 'react';
import classNames from 'classnames';

export default class Spinner extends React.Component {
	render() {
		return (
			<div className={classNames('spinnerContainer clearfix', this.props.className)}>
				<div className="spinner">
					<svg viewBox="0 0 50 50" className={classNames("spinnerIcon", this.props.spinnerClassName)}>
						<circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
					</svg>
				</div>
			</div>
		);
	}
}
