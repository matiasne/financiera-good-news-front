import classNames from "classnames"
import React from "react";

export function Row({ cols = 12, gap = 4, verticalGap = false, children, ...props }) {
	const childrenWithProps = React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			let newProps = { ...props };
			return React.cloneElement(child, { ...newProps });
		}
		return child;
	});

	let gapClasses = CreateGapClasses(gap);

	return (
		<div {...props} className={classNames("row", ["row-" + cols], gapClasses, { "row-gap-vertical": verticalGap })} >
			{childrenWithProps}
		</div>
	)
}

export function Rows({ cols = 12, gap = 4, verticalGap = true, children, ...props }) {
	const childrenWithProps = React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			let newProps = {
				cols: child.props.cols || cols,
				gap: child.props.gap || gap,
				verticalGap: verticalGap
			};
			return React.cloneElement(child, { ...newProps });
		}
		return child;
	});

	let gapClasses = CreateGapClasses(gap, 'rows');

	return (
		<div {...props} className={"rows"} >
			{childrenWithProps}
		</div>
	)
}

export default function Col(
	{
		span = 1,
		children,
		auto = false,
		grow = false,
		...props
	}
) {

	let spanClasses = [];
	if (span.toString().indexOf(':') > -1) {
		span.split(' ').map((sp) => {
			if (sp.indexOf(':') > -1) {
				const spp = sp.split(':');
				spanClasses.push(spp[0] + ':col-' + spp[1]);
			} else {
				spanClasses.push('col-' + sp);
			}
		})
	} else {
		spanClasses.push("col-" + span);
	}

	return (
		<div {...props} className={classNames("col", auto && "col-auto", grow && "col-grow", !grow && !auto && spanClasses)} >
			{children}
		</div>
	)
}

export function Container({ size = '', className, children, ...props }) {
	// size can be: fluid, md, sm, or null
	return (
		<div className={classNames(!size && 'container', { ['container-' + size]: size }, className)} {...props} >
			{children}
		</div>
	)
}



// PRIVATE
function CreateGapClasses(gap, prefix = 'row') {
	let gapClasses = [];
	if (gap.toString().indexOf(':') > -1) {
		gap.split(' ').map((sp) => {
			if (sp.indexOf(':') > -1) {
				const spp = sp.split(':');
				gapClasses.push(spp[0] + ':' + prefix + '-gap-' + spp[1]);
			} else {
				gapClasses.push(prefix + '-gap-' + sp);
			}
		})
	} else {
		gapClasses.push(prefix + '-gap-' + gap);
	}

	return gapClasses;
}
