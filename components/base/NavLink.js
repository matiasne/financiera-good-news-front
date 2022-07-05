import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Children } from 'react'

const NavLink = ({ children, activeClassName = '--active', activeLink, isActive, ...props }) => {
	const { asPath } = useRouter()
	const child = Children.only(children)
	const childClassName = child.props.className || ''

	// pages/index.js will be matched via props.href
	// pages/about.js will be matched via props.href
	// pages/[slug].js will be matched via props.as
	// pages/user/* will be matched via props.activeLink
	const className =
		asPath === props.href || asPath === props.as || asPath.indexOf(activeLink) > -1 || isActive
			? `${childClassName} ${activeClassName}`.trim()
			: childClassName

	return (
		<Link {...props} passHref>
			{React.cloneElement(child, {
				className: className || null,
			})}
		</Link>
	)
}

/*NavLink.propTypes = {
	activeClassName: PropTypes.string.isRequired,
}*/

export default NavLink
