import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import Icon from './Icons'


export default function Button(
	{
		type = '', // outline link
		variant = 'main', // main success error warning info dark light neutral neutraldark
		label = '',
		size = 'md',
		iconStart = null,
		iconEnd = null,
		iconClass = '',
		className = '',
		clickEffect = true,
		onClick = null,
		pill = false,
		isFilled = false,
		isSelected = false,
		isFull = false,
		isElevated = true,
		children = null,
		isLabel = false,
		...props
	}
) {

	const [ripplePosition, setRipplePosition] = useState({ x: '50%', y: '50%' });
	const [isAnimating, setAnimating] = useState(false);

	// const [clickCount, setClickCount] = useState(0);
	// const [clicksData, setClicksData] = useState([]);

	function rippleEffect(e) {
		// e = Mouse click event.
		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top;  //y position within the element.
		// console.log("Left? : " + x + " ; Top? : " + y + ".");
		setRipplePosition({ x: x, y: y });
	}

	function handleClick(e) {
		if (clickEffect) {
			rippleEffect(e);
			setAnimating(true);
			// setClickCount(clickCount + 1);
			// setClicksData({ ...clicksData, [clickCount]: e });
			setTimeout(() => {
				setAnimating(false);
				// setClickCount(clickCount - 1);
				// setClicksData(clicksData.shift());
			}, 520);
		}
		onClick && onClick(e);
	}

	const prefix = 'btn-';
	let buttonContent = <>
		{iconStart && <Icon glyph={iconStart} className={iconClass} />}
		{children || label || null}
		{iconEnd && <Icon glyph={iconEnd} className={iconClass} />}
	</>;

	return (
		<button className={classNames(
			'btn',
			{ [prefix + variant]: variant },
			{ [prefix + type]: type },
			{ [prefix + size]: size },
			{ '--filled': isFilled },
			{ '--selected': isSelected },
			{ 'rounded-full': pill },
			{ '--plain': !isElevated && !type !== 'outline' },
			{ 'w-full': isFull },
			{ '--label': isLabel },
			className
		)} {...props} onClick={handleClick} >
			{buttonContent}
			{clickEffect && isAnimating &&
				<div className={classNames("btn__effect-container", { 'rounded-full': pill })}>
					<span className={classNames("btn__ripple", { '--active': isAnimating })} style={{ top: ripplePosition.y + 'px', left: ripplePosition.x + 'px' }}></span>
				</div>
			}
		</button>
	);
}

export function ButtonGroup(
	{
		children,
		dividers = false,
		vertical = false,
		style = null,
		className = null,
		isFull = false,
		...props
	}
) {

	const childrenWithProps = React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			let newProps = { ...props };
			newProps.isFull = isFull;
			return React.cloneElement(child, { ...newProps });
		}
		return child;
	});


	return (
		<div className={
			classNames(
				"btn-group",
				{ '--vertical': vertical },
				{ 'w-full': isFull },
				{ ['btn-' + props.variant]: props.variant },
				{ ['btn-' + props.type]: props.type },
				className
			)
		}
			style={style}>
			{dividers ?
				childrenWithProps.map((child, i) => {
					return <>
						{child}
						{i < children.length - 1 && <span className="btn-group-divider"></span>}
					</>
				})
				:
				childrenWithProps
			}
		</div>
	)
}

export function IconButton(
	{
		type = '',
		glyph = 'plus',
		variant = 'main',
		label = '',
		size = 'md',
		className = '',
		clickEffect = true,
		onClick = null,
		children = null,
		isElevated = true,
		isFilled = false,
		...props
	}
) {

	const [ripplePosition, setRipplePosition] = useState({ x: '50%', y: '50%' });
	const [isAnimating, setAnimating] = useState(false);

	function rippleEffect(e) {
		// e = Mouse click event.
		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top;  //y position within the element.
		// console.log("Left? : " + x + " ; Top? : " + y + ".");
		setRipplePosition({ x: x, y: y });
	}

	function handleClick(e) {
		if (clickEffect) {
			rippleEffect(e);
			setAnimating(true);
			setTimeout(() => {
				setAnimating(false);
			}, 520);
		}
		onClick && onClick(e);
	}

	const prefix = 'btn-';


	return (
		<button aria-label={label} type="button" className={classNames(
			'btn',
			[prefix + 'rounded'],
			{ [prefix + variant]: variant },
			{ [prefix + type]: type },
			{ [prefix + size]: size },
			{ '--plain': !isElevated },
			{ '--filled': isFilled },
			className
		)} {...props} onClick={handleClick} >
			{glyph ?
				<Icon glyph={glyph} />
				:
				children
			}
			{clickEffect && isAnimating &&
				<div className="btn__effect-container">
					<span className={classNames("btn__ripple", { '--active': isAnimating })} style={{ top: ripplePosition.y + 'px', left: ripplePosition.x + 'px' }}></span>
				</div>
			}
		</button>
	);
}

function Ripple(e) {
	const [ripplePosition, setRipplePosition] = useState({ x: '50%', y: '50%' });
	const [isAnimating, setAnimating] = useState(true);

	useEffect(() => {
		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top;  //y position within the element.
		setRipplePosition({ x: x, y: y });
	}, [e]);

	return <span
		className={classNames("btn__ripple", { '--active': isAnimating })}
		style={{ top: ripplePosition.y + 'px', left: ripplePosition.x + 'px' }}
	>
	</span>
}
