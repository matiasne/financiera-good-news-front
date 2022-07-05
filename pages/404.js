import Headings from '@/adapters/Headings';
import MainLayout from '@/components/layout/MainLayout';
import Head from 'next/head';
import React from "react";

function Page() {
	return (
		<>
			<Head>
				{Headings({})}
			</Head>

			<div className="container-fluid">
				<div className="h-screen flex items-center justify-center">
					<h1 className="text-welcome">Error 404</h1>
				</div>
			</div>
		</>
	)
}


Page.layout = MainLayout;
export default Page
