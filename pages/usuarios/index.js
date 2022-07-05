import Headings from '@/adapters/Headings'
import QueryContent from '@/adapters/Querys'
import { Container } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import NoResults from '@/components/base/NoResults'
import MainLayout from '@/components/layout/MainLayout'
import classNames from 'classnames'
import Head from 'next/head'
import { useState } from 'react'

const Page = ({ session }) => {
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<>
			<Head>
				{Headings('Usuarios')}
			</Head>


			<article className="contentSet">

				<div className="contentSet__shrink">
					{/* FILTERS */}
					<div className="flex gap-3 justify-end">
						{/* <PillSwitcher name="filters" options={['Clientes', 'Cuentas']} className="border-gray-200" /> */}
						<div className="w-80">
							<Input type="text" name="search" placeholder="Buscar por Nombre..." iconStart="search" onChange={(e) => setSearchQuery(e.value)} value={searchQuery} />
						</div>
					</div>
				</div>

				<div className="contentSet__scrollable">
					{/* CARD LIST */}
					<Container size="sm" className="px-4">

						<h1 className="text-center h2 text-gray-400">Próximamente</h1>

						{/* <QueryContent
							id="test"
							queryData={{
								page: page,
								size: 50,
								sort: "name",
								order: "asc"
							}}
							session={session}
							content={(data) => {
								let items = data.data;
								return <>
									{items.length > 0 ?
										items.map((item, i) => {
											return <div key={item.id}>
												<h1>{item.name}</h1>
											</div>
										})
										:
										<NoResults />
									}

									<p>Página {page}</p>
									<button className="btn" onClick={() => setPage(page - 1)} disabled={page === 1}>anterior</button>
									<button className="btn" onClick={() => setPage(page + 1)}>siguiente</button>
								</>
							}}
						/> */}

					</Container>
				</div>

			</article>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Usuarios',
	actionLink: '/usuarios/nuevo'
}
export default Page
