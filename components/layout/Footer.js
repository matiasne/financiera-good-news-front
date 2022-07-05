import mySmoothScroll from '@/adapters/smoothScroll'
import React, { useLayoutEffect } from 'react'

export default function Footer() {

	useLayoutEffect(() => {
		mySmoothScroll();
	}, [])

	return (
		<footer>
			<div className="container-fluid">
				<p>All rights reserved</p>
			</div>
		</footer>


	)
}
