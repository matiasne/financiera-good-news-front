import { parseDatetime, parseMoney, parseStatus } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Spinner from '@/components/base/Spinner'
import { Card_Saldo } from '@/components/Cards'
import MainLayout from '@/components/layout/MainLayout'
import axios from 'axios'
import router from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import { useMutation } from 'react-query'
import Table from '@/components/base/Table'
import { AdvancedFilters } from './transacciones'
import classNames from 'classnames'

function Page({ session }) {
	const [isConfirming, setConfirming] = useState(false);
	const [sort, setSort] = useState('createdAt');
	const [order, setOrder] = useState('desc');

	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({});


	const mutation = useMutation(formData => {
		return axios(getQueryFullData('sendMails', {}, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			setConfirming(false);
			toast.error('Ocurrió un error al enviar emails');
		},
		onSuccess: (data, variables, context) => {
			toast.success('Emails enviados correctamente');
		},
		onSettled: () => {
			setConfirming(false);
		},
	})

	const queryParams = {
		singular: 'Depósito',
		id: 'depositoSearch',
		tableHead: [
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
				id: 'customerName',
				label: 'Cliente',
				type: 'text',
				getContent: (e) => e.customerName,
			},
			{
				id: 'providerName',
				label: 'Proveedor',
				type: 'text',
				getContent: (e) => e.providerName,
			},
			{
				id: 'providerAccountName',
				label: 'Cuenta',
				type: 'text',
				getContent: (e) => e.providerAccountName || '-',
			},
			{
				id: 'providerAccountNumber',
				label: 'Cuenta Nro.',
				type: 'text',
				getContent: (e) => e.providerAccountNumber || '-',
			},
			// {
			// 	id: 'status',
			// 	label: 'Estado',
			// 	type: 'text',
			// 	getContent: (e) => parseStatus(e.status),
			// },
			{
				id: 'total',
				label: 'Monto',
				type: 'money',
				getContent: (e) => e.total,
			},
			{
				id: 'total',
				label: 'Ganancia Financiera',
				type: 'money',
				isSortable: false,
				getContent: (e) => (e.customerFee - e.providerAccountFee) / 100 * e.total,
			},

		],
		tableActions: [
			{
				label: 'Ver detalle',
				icon: 'file',
				makeLink: (e) => '/transacciones?viewId=' + e.id + '&viewType=' + 'Depósitos'
			},
			{
				label: 'Exportar PDF',
				icon: 'fileexport',
				makeLink: (e) => '/transacciones/detalle/' + 'depositos' + '/' + e.id
			},
		],
		detailBody: (data) => {
			return <div className='text-left'>
				<Rows cols={4}>
					<Row>
						<Col span={2}>
							<Card_Persona_Small
								title={data.customer.name}
							/>
						</Col>
						<Col span={2}>
							<Card_Persona_Small glyph="moneybag"
								title={'#' + data.providerAccount.accountNumber}
								postitle={data.providerAccount.provider.name}
							/>
						</Col>
					</Row>
					<Row cols={4}>
						<Col>
							<div className="dataSet">
								<p className='dataSet__title'>Fecha</p>
								<p>{parseDatetime(data.createdAt)}</p>
							</div>
						</Col>
						<Col>
							<div className="dataSet">
								<p className='dataSet__title'>Tipo</p>
								<p>Depósito</p>
							</div>
						</Col>
						<Col>
							<div className="dataSet">
								<p className='dataSet__title'>Monto</p>
								<p>{parseMoney(data.total)}</p>
							</div>
						</Col>
						<Col>
							<div className="dataSet">
								<p className='dataSet__title'>Estado</p>
								<p>{parseStatus(data.status)}</p>
							</div>
						</Col>
						<Col>
							<div className="dataSet">
								<p className='dataSet__title'>Comprobante</p>
								<p>{'#' + data.internalId}</p>
							</div>
						</Col>
						<Col>
							<div className="dataSet">
								<p className='dataSet__title'>CUIT</p>
								<p>{data.cuit || '-'}</p>
							</div>
						</Col>
					</Row>
					<Row>
						<Col span={4}>
							<div className="dataSet">
								<p className='dataSet__title'>Notas</p>
								<p>{data.notes || '-'}</p>
							</div>
						</Col>
					</Row>
				</Rows>
				{data.file && data.file.indexOf('data:') > -1 ?
					<div className="mt-4">
						{data.file.indexOf('data:image') > -1 ?
							<div className="file-iframe"><img src={data.file} /></div>
							:
							<iframe src={data.file} className="file-iframe" />
						}
					</div>
					:
					<p className='my-8 text-center italic'>Sin Comprobante</p>
				}
			</div>
		}
	};

	return (
		<>
			<article className="contentSet">
				<div className="contentSet__shrink">
					<div className="flex gap-3 justify-between">
						<Button iconStart={'emails'} onClick={(e) => setConfirming(true)}> Enviar emails diarios</Button>
					</div>
				</div>

				<div className="contentSet__shrink">
					<QueryContent id={"balances"} session={session}
						loadWhenUpdating
						content={(data) => {
							return <Row cols={3} gap={'4 md:6'} verticalGap >
								{data.map((saldo, i) => {
									let title = '';
									switch (saldo.type) {
										case "CUSTOMER":
											title = 'Saldo Clientes'
											break;

										case "PROVIDER":
											title = 'Saldo Proveedores'
											break;

										default:
											title = 'Caja Financiera'
											break;
									}
									return <Col>
										<Card_Saldo
											title={title}
											body={saldo.total}
										/>
									</Col>
								})}
							</Row>
						}}
					/>
				</div>

				<div className="contentSet__shrink">
					<div className="flex gap-3 flex-end justify-end">
						<Button type='light' variant='outline' isFilled iconStart="filters" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</Button>
					</div>
				</div>

				{/* ALL FILTERS */}
				<div className={classNames("contentSet__shrink", { 'hidden': !showFilters })}>
					<AdvancedFilters session={session} onFilter={setFilters} pillValue={'Depósitos'} startFromToday />
				</div>

				<div className="contentSet__scrollable">
					<Container size="fluid">
						<QueryContent
							id={queryParams.id}
							queryData={{
								size: 100,
								sort: sort,
								order: order,
								...filters
							}}
							hasPagination
							session={session}
							// loadWhenUpdating
							content={(data, queryData) => {
								let items = data.data;
								let total = 0;
								items?.map((item, i) => total += item.total);
								return <div>
									<div class="dataSet my-0 float-right">
										<h2>Total Ganancia: {parseMoney(total)}</h2>
									</div>
									<Table striped={false} lined={true}
										tableData={items}
										queryData={queryData}
										tableHead={queryParams.tableHead}
										tableActions={queryParams.tableActions}
										isTableActionsCompressed={false}
										onSort={(e) => {
											setOrder(e.order);
											setSort(e.sort);
										}}
									/>
								</div>
							}}
						/>
					</Container>
				</div>
			</article>


			<Modal
				display={isConfirming}
				title={'Enviar emails'}
				description={'¿Confirma que desea realizar esta acción?'}
				// isLoading={mutation.isLoading}
				// loadingContent={<Spinner />}
				className="text-button font-bold text-gray-500 py-4"
				options={[
					{
						text: 'Confirmar',
						handler: () => {
							mutation.mutate();
							setConfirming(false);
						},
					}
				]}
				cancel={{
					text: 'Cancelar',
					handler: () => setConfirming(false),
				}}
			/>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Dashboard'
}
export default Page
