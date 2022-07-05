import Header from '@/components/layout/Header';
import { getCookie, setCookies } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Icon from '../base/Icons';
import SideNav from './SideNav';

export default function MainLayout({ title, actionLink, actionMenu, children, role = 'ADMIN', session, ...props }) {
	const [menuIsCollapsed, setMenuCollapsed] = useState(getCookie('menuIsCollapsed') || false);

	useEffect(() => {
		setCookies('menuIsCollapsed', menuIsCollapsed);
	}, [menuIsCollapsed]);

	return (
		<>
			<main className="main">
				<div id="logo" className="relative overflow-hidden">
					<SwitchTransition>
						<CSSTransition
							key={menuIsCollapsed}
							addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
							classNames='fade'
						>
							<h2 className="text-white font-bold text-h5 whitespace-nowrap absolute">{menuIsCollapsed ? 'GN' : 'Good News'}</h2>
						</CSSTransition>
					</SwitchTransition>
				</div>

				<Header role={role} title={title} actionLink={actionLink} actionMenu={actionMenu} session={session} />

				<SideNav role={role} menuIsCollapsed={menuIsCollapsed} setMenuCollapsed={(e) => setMenuCollapsed(e)} />

				<section>
					<SwitchTransition>
						<CSSTransition
							key={title || '404'}
							addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
							classNames='slideUp'
						>
							{children}
						</CSSTransition>
					</SwitchTransition>

					<Toaster
						position="bottom-center"
						containerClassName="absolute"
						toastOptions={{
							className: 'rounded-lg text-sm',
							duration: 5000,
							success: {
								className: 'bg-green text-white shadow-green shadow',
								icon: <Icon glyph="success" className="text-icon-sm" />,
							},
							error: {
								className: 'bg-red text-white shadow-red shadow',
								icon: <Icon glyph="warning" className="text-icon-sm" />,
								// iconTheme: {
								// 	primary: '#fff',
								// 	secondary: 'red',
								// }
							},
						}}
					/>
				</section>

			</main>

			{/* <Footer /> */}
		</>

	)
}
