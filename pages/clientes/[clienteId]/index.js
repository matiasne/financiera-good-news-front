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
import Col, { Container, Row, Rows } from '@/components/base/Grid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { parseDatetime, parseThousands } from '@/adapters/Parsers'


const Page = ({ session }) => {
	const router = useRouter();
	const [sort, setSort] = useState('createdAt');
	const [order, setOrder] = useState('desc');
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

	const tableHead = [
		{
			id: 'id',
			label: 'ID',
			type: 'id',
			getContent: (e) => e.id,
		},
		{
			id: 'createdAt',
			label: 'Fecha',
			type: 'id',
			getContent: (e) => parseDatetime(e.createdAt),
		},
		{
			id: 'concept',
			label: 'Concepto',
			type: 'text',
			getContent: (e) => e.concept,
			isSortable: false,
		},
		{
			id: 'total',
			label: 'Monto',
			type: 'money',
			getContent: (e) => e.total,
			isSortable: false,
		},
		{
			id: 'balance',
			label: 'Balance',
			type: 'money',
			getContent: (e) => e.balance,
			isSortable: false,
		},
	];

	const tableHeadCommisions = [
		{
			id: 'id',
			label: 'ID',
			type: 'id',
			getContent: (e) => e.id,
		},
		{
			id: 'provider',
			label: 'Proveedor',
			type: 'text',
			getContent: (e) => e.providerAccount.provider.name,
		},
		{
			id: 'accountNumber',
			label: 'Nro. Cuenta',
			type: 'id',
			getContent: (e) => '#' + e.providerAccount.accountNumber,
		},
		{
			id: 'quota',
			label: 'Cupo',
			type: 'text',
			getContent: (e) => parseThousands(e.providerAccount.quota),
		},
		{
			id: 'type',
			label: 'Tipo Cuenta',
			type: 'text',
			getContent: (e) => e.providerAccount.type + ' • ' + e.providerAccount.bank,
		},
		{
			id: 'fee',
			label: 'Comisión',
			type: 'percent',
			getContent: (e) => e.fee,
		},
		{
			id: 'accountNumber',
			label: 'Comisión P.',
			type: 'percent',
			getContent: (e) => e.providerAccount.fee,
		},
		//accountNumber providerAccount.quota		providerAccount.type 	providerAccount.fee providerAccount.provider.name
	];

	return (
		<>
			<article className="contentSet">
				<div className="contentSet__scrollable">
					{/* PRESENTATION CARD */}
					<Container size="sm" className="pt-4">
						<div className="flex flex-col gap-3">

							<QueryContent
								id="clientGet"
								queryData={router?.query.clienteId || 0}
								session={session}
								content={(data, queryData) => {
									return <Card_Persona data={data} />
								}}
							/>

							<div className='flex gap-2'>
								<Link href={'/clientes/' + router?.query?.clienteId + '/editar'}>
									<a>
										<Button type="neutraldark" iconStart="edit">Editar Cliente</Button>
									</a>
								</Link>
								<Link href={'/clientes/' + router?.query?.clienteId + '/cuentas'}>
									<a>
										<Button type="neutraldark" iconStart="editfile">Editar Comisiones</Button>
									</a>
								</Link>
								<div className='flex-1'></div>
								<Link href={"/transacciones/nuevo/deposito?clienteId=" + router?.query?.clienteId}>
									<a>
										<Button type="success" iconStart="moneyexchange">Registrar Depósito</Button>
									</a>
								</Link>
							</div>
						</div>
					</Container>

					<Container size='fluid' className="mt-6">

						<h3 className='h4 mb-2 mt-6 text-gray-600'>Cuentas y Comisiones</h3>
						<QueryContent
							id={"clientcommissionGet"}
							queryData={parseInt(router?.query?.clienteId || 0)}
							session={session}
							content={(data, queryData) => {
								let items = data;
								console.log(items);
								return <Table striped={false} lined={true}
									isSortable={false}
									tableData={items}
									tableHead={tableHeadCommisions}
									queryData={queryData}
								// onSort={(e) => {
								// 	setOrder(e.order);
								// 	setSort(e.sort);
								// }}
								/>
							}}
						/>

						<h3 className='h4 mb-2 mt-6 text-gray-600'>Envíos Pendientes</h3>
						<QueryContent
							id={"envioSearch"}
							queryData={{
								size: 20,
								sort: 'id',
								order: 'desc',
								customerId: router?.query?.clienteId || 0,
								payed: false,
								// ...filters
							}}
							hasPagination
							session={session}
							content={(data, queryData) => {
								let items = data.data;
								return <Table striped={false} lined={true}
									tableData={items}
									queryData={queryData}
									isSortable={false}
									tableHead={[
										{
											id: 'id',
											label: 'ID',
											type: 'id',
											getContent: (e) => e.id,
										},
										{
											id: 'createdAt',
											label: 'Fecha',
											type: 'id',
											getContent: (e) => parseDatetime(e.createdAt),
										},
										{
											id: 'providerName',
											label: 'Destinatario',
											type: 'text',
											getContent: (e) => e.receiverName + ' (' + e.receiverDocument + ')',
										},
										{
											id: 'total',
											label: 'Monto',
											type: 'money',
											getContent: (e) => e.total,
										},

									]}
								// onSort={(e) => {
								// 	setOrder(e.order);
								// 	setSort(e.sort);
								// }}
								/>
							}}
						/>

						<h3 className='h4 mb-2 mt-6 text-gray-600'>Balance</h3>
						<QueryContent
							id={"movimientoSearch"}
							queryData={{
								size: 20,
								sort: sort,
								order: order,
								personId: parseInt(router?.query?.clienteId || 0),
								// ...filters
							}}
							hasPagination
							session={session}
							content={(data, queryData) => {
								let items = data.data;
								return <Table striped={false} lined={true}
									tableData={items}
									tableHead={tableHead}
									queryData={queryData}
									isSortable={false}
								// onSort={(e) => {
								// 	setOrder(e.order);
								// 	setSort(e.sort);
								// }}
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
	title: 'Detalle de Cliente'
}
export default Page
