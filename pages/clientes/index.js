import Headings from '@/adapters/Headings'
import QueryContent, { getQueryFullData } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Input from '@/components/base/Inputs'
import NoResults from '@/components/base/NoResults'
import Spinner from '@/components/base/Spinner'
import { Card_Persona, Card_Saldo } from '@/components/Cards'
import MainLayout from '@/components/layout/MainLayout'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import Table from '@/components/base/Table'
import { Container } from '@/components/base/Grid'
import Link from 'next/link'


const Page = ({ session }) => {
	const [sort, setSort] = useState('name');
	const [order, setOrder] = useState('asc');
	const [deleteId, setDeleteId] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

	const mutationDelete = useMutation(formData => {
		return axios(getQueryFullData('clientDelete', deleteId, session))
	}, {
		onSuccess: (data) => {
			toast('Cliente eliminado exitosamente');
		},
		onError: (err) => {
			toast.error('Ocurrió un error');
		},
		onSettled: (data) => {
			setDeleteId(0);
		}
	})

	return (
		<>

			<article className="contentSet">

				<div className="contentSet__shrink">
					{/* FILTERS */}
					<div className="flex gap-3 justify-between">
						<div></div>
						<div className="w-80">
							<Input type="text" name="search" placeholder="Buscar por Nombre..." iconStart="search" onChange={(e) => setSearchQuery(e.value)} value={searchQuery} />
						</div>
					</div>
				</div>

				<div className="contentSet__scrollable">
					{/* TABLE */}
					<Container size='md'>
						<QueryContent
							id="clientSearch"
							hasPagination
							queryData={{
								size: 25,
								sort: sort,
								order: order,
								name: searchQuery,
							}}
							session={session}
							emptyContent={<NoResults />}
							content={(data, queryData) => {
								// let items = data.data;
								// return <div className="flex flex-col gap-3 withScoll">
								// 	{items.length > 0 && items.map((item, i) => {
								// 		return <Card_Persona key={i} data={item} onDelete={setDeleteId} />
								// 	})}
								// </div>
								return <Table striped={false} lined={true}
									tableData={data.data || []}
									queryData={queryData}
									onSort={(e) => {
										setOrder(e.order);
										setSort(e.sort);
									}}
									tableHead={[
										{
											id: 'id',
											label: 'ID',
											type: 'id',
											getContent: (e) => e.id,
										},
										{
											id: 'name',
											label: 'Nombre',
											type: 'html',
											getContent: (e) => <Link href={'/movimientos?clienteId=' + e.id}><a className='font-bold hover:text-main duration-200'>{e.name}</a></Link>,
										},
										{
											id: 'email',
											label: 'Email',
											type: 'text',
											getContent: (e) => e.email,
											isSortable: false,
										},
										{
											id: 'balance',
											label: 'Saldo',
											type: 'money',
											getContent: (e) => e.balance,
										},

									]}
									tableActions={[
										{
											label: 'Ver Detalle Cliente',
											icon: 'user',
											makeLink: (data) => '/clientes/' + data.id,
										},
										{
											label: 'Ver Balance',
											icon: 'invoice',
											makeLink: (data) => '/movimientos?clienteId=' + data.id,
										},
										{
											isDivider: true
										},
										{
											label: 'Nuevo Depósito',
											icon: 'moneyexchange',
											makeLink: (data) => '/transacciones/nuevo/deposito?clienteId=' + data.id,
										},
										{
											label: 'Nuevo Retiro',
											icon: 'moneyexchange',
											makeLink: (data) => '/transacciones/nuevo/retiro?clienteId=' + data.id,
										},
										{
											label: 'Nuevo Envío',
											icon: 'exchange',
											makeLink: (data) => '/envios/nuevo?clienteId=' + data.id,
										},
										{
											isDivider: true
										},
										{
											label: 'Editar Comisiones',
											icon: 'editfile',
											makeLink: (data) => '/clientes/' + data.id + '/cuentas',
										},
										{
											label: 'Editar Cliente',
											icon: 'edit',
											makeLink: (data) => '/clientes/' + data.id + '/editar',
										},
										// {
										// 	label: 'Eliminar',
										// 	icon: 'delete',
										// 	handler: (data) => setDeleteId(data.id)
										// }
									]}
								/>
							}}
						/>

					</Container>
				</div>

			</article>

			<Modal
				title={'Eliminar Cliente'}
				description={'¿Está seguro que desea eliminar este elemento? Esta acción no podrá deshacerse.'}
				display={deleteId > 0}
				className="text-button font-bold text-gray-500 py-4"
				isLoading={mutationDelete.isLoading}
				loadingContent={<Spinner />}
				options={[
					{
						text: 'Eliminar',
						handler: () => mutationDelete.mutate({ id: deleteId }),
						className: 'text-red'
					}
				]}
				cancel={{
					text: 'Cancelar',
					handler: () => { setDeleteId(0); mutationDelete.reset(); }
				}}
			/>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Clientes',
	actionLink: '/clientes/nuevo'
}
export default Page
