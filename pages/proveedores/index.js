import QueryContent, { getQueryFullData } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import { Container } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import NoResults from '@/components/base/NoResults'
import Spinner from '@/components/base/Spinner'
import Table from '@/components/base/Table'
import { Card_Persona } from '@/components/Cards'
import MainLayout from '@/components/layout/MainLayout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { PillSwitcher } from 'react-pill-switcher'
import { useMutation } from 'react-query'
import { CSSTransition, SwitchTransition } from "react-transition-group"
import Link from 'next/link'


const Page = ({ session, ...props }) => {
	const [pillValue, setPillValue] = useState('Proveedores');
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearchLoading, setSearchLoading] = useState(false);

	const [sort, setSort] = useState('name');
	const [order, setOrder] = useState('asc');
	const [deleteId, setDeleteId] = useState(0);

	const mutationDelete = useMutation(formData => {
		return axios(getQueryFullData('providerDelete', deleteId, session))
	}, {
		onSuccess: (data) => {
			toast('Proveedor eliminado exitosamente');
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
						<PillSwitcher name="filters" options={['Proveedores', 'Cuentas']} onChange={(e) => { setPillValue(e); setSort(e === 'Cuentas' ? 'providerName' : 'name'); setOrder('asc') }} />
						<div className="w-80">
							<Input type="text" name="search" placeholder="Buscar por Nombre..." iconStart="search"
								sufix={isSearchLoading && <Spinner spinnerClassName="w-4 h-4 text-main" className="w-4 h-4" />}
								onChange={(e) => {
									setSearchQuery(e.value);
									setSearchLoading(true);
								}} value={searchQuery} />
						</div>
					</div>
				</div>

				<SwitchTransition>
					<CSSTransition
						key={pillValue}
						addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
						classNames='fade'
					>
						<div className="contentSet__scrollable">
							{/* CARD LIST */}
							{
								pillValue === 'Proveedores'
									?
									<Container size='md'>
										<QueryContent
											id="providerSearch"
											queryData={{
												sort: sort,
												order: order,
												size: 20,
												name: searchQuery,
											}}
											onUpdated={(e) => setSearchLoading(false)}
											session={session}
											hasPagination
											emptyContent={<NoResults />}
											content={(data, queryData) => {
												// let items = data.data;
												// return <div className="flex flex-col gap-3 withScoll">
												// 	{items.length > 0 && items.map((item, i) => {
												// 		return <Card_Persona isProveedor key={i} data={item} onDelete={setDeleteId} />
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
															// getContent: (e) => e.name,
															getContent: (e) => <Link href={'/movimientos?proveedorId=' + e.id}><a className='font-bold hover:text-main duration-200'>{e.name}</a></Link>,
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
															label: 'Nuevo Pago',
															icon: 'moneyexchange',
															makeLink: (data) => '/transacciones/nuevo/pagoProveedor?proveedorId=' + data.id,
														},
														{
															isDivider: true,
														},
														{
															label: 'Ver Balance',
															icon: 'invoice',
															makeLink: (data) => '/movimientos?proveedorId=' + data.id,
														},
														{
															label: 'Ver Transacciones',
															icon: 'moneyexchange',
															makeLink: (data) => '/transacciones?proveedorId=' + data.id,
														},
														{
															isDivider: true,
														},
														{
															label: 'Editar Cuentas',
															icon: 'editfile',
															makeLink: (data) => '/proveedores/' + data.id + '/cuentas',
														},
														{
															label: 'Editar Proveedor',
															icon: 'edit',
															makeLink: (data) => '/proveedores/' + data.id + '/editar',
														},
														// {
														// 	label: 'Eliminar',
														// 	icon: 'delete',
														// 	handler: () => onDelete(data.id)
														// }
													]}
												/>
											}}
										/>
									</Container>

									:
									<Container>
										<QueryContent
											id="providerAccountsSearch"
											queryData={{
												sort: sort,
												order: order,
												size: 20,
												name: searchQuery,
											}}
											hasPagination
											emptyContent={<NoResults />}
											onUpdated={(e) => setSearchLoading(false)}
											session={session}
											content={(data, queryData) => {
												let items = data.data;
												return <Table striped={true} lined={true}
													tableData={items}
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
															id: 'providerName',
															label: 'Proveedor',
															type: 'id',
															grouped: true,
															getContent: (e) => e.providerName,
														},
														{
															id: 'accountNumber',
															label: 'Nro. Cuenta',
															type: 'html',
															// getContent: (e) => '#' + e.accountNumber,
															getContent: (e) => <Link href={'/movimientos?cuentaProveedorId=' + e.id}><a className='hover:text-main duration-200'>{e.name}</a></Link>,
														},
														{
															id: 'name',
															label: 'Nombre',
															type: 'text',
															getContent: (e) => '#' + e.name,
														},
														{
															id: 'cbu',
															label: 'CBU',
															type: 'text',
															getContent: (e) => e.cbu,
														},
														{
															id: 'bank',
															label: 'Banco',
															type: 'text',
															getContent: (e) => e.bank,
														},
														{
															id: 'type',
															label: 'Tipo',
															type: 'text',
															getContent: (e) => e.type,
														},
														{
															id: 'quota',
															label: 'Cupo',
															type: 'thousands',
															getContent: (e) => e.quota,
														},
														{
															id: 'fee',
															label: 'Comisión',
															type: 'percent',
															getContent: (e) => e.fee,
														},

													]}
													tableActions={[
														{
															label: 'Ver Balance',
															icon: 'invoice',
															makeLink: (data) => '/movimientos?cuentaProveedorId=' + data.id,
														},
													]}
												/>
											}}
										/>
									</Container>
							}


						</div>
					</CSSTransition>
				</SwitchTransition>

			</article>

			<Modal
				title={'Eliminar Proveedor'}
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
	title: 'Proveedores',
	actionLink: '/proveedores/nuevo'
}
export default Page
