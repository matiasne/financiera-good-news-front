import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'next-auth/client'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Spinner from '@/components/base/Spinner'
import Headings from '@/adapters/Headings'
import Head from 'next/head'

import '@/styles/root/_globals.scss'
import '@/styles/root/_defaults.scss'

import 'react-gold-modal/src/styles.scss'
import 'react-pill-switcher/styles/styles.scss'

import '@/styles/components/inputs.scss'
import '@/styles/components/buttons.scss'
import '@/styles/components/tables.scss'
import '@/styles/layout.scss'
import '@/styles/main.scss'
import { getCookie, getCookies } from 'cookies-next'


const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

function MyApp({ Component, pageProps, children }) {
	const [session, sessionLoading] = useSession();
	const router = useRouter();

	const Layout = Component.layout || React.Fragment;
	const layoutProps = Component.layoutProps || {};

	if (!sessionLoading && router.isReady) {
		if (!session && router.route.indexOf('login') < 0 && router.route.indexOf('tickets') < 0) {
			router.push('/login');
		} else {
			if (session && Date.parse(session.expires) <= Date.now()) {
				router.push('/login');
			}
			if (Layout) {
				let userRole;
				let permittedRoutes;
				if (!layoutProps.role && session) {
					switch (session.username) {
						case 'admin': case 'administrador':
							userRole = 'ADMIN';
							break;
						case 'customer':
							userRole = 'EDITOR';
							permittedRoutes = ['/transacciones'];
							break;
					}

					if (permittedRoutes) {
						let shouldBlockPage = true;
						permittedRoutes.map((route) => {
							if (router.route.indexOf(route) > -1) {
								shouldBlockPage = false;
							}
						});
						if (shouldBlockPage) router.push(permittedRoutes[0]);
					}
				}

				return (
					<Provider session={pageProps.session} >
						<QueryClientProvider client={queryClient} >
							<Layout {...layoutProps} role={userRole || layoutProps?.role} session={session} >
								<>
									{layoutProps.title &&
										<Head>
											{Headings({ pageTitle: layoutProps.title })}
										</Head>
									}
									<Component {...pageProps} role={userRole || layoutProps?.role} session={session} />
								</>
							</Layout>
						</QueryClientProvider>
					</Provider>
				)
			} else {
				return <Component {...pageProps} />
			}
		}
	}

	return <div className="w-full h-screen flex justify-center items-center">
		<Spinner />
	</div>


}

export default MyApp
