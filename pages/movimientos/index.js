import { forceTime, parseDatetime, parseDtype, parseMoney, parseTotalMoney, parseStatus, getToday } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData, QueryAutocomplete,QueryMultipleSelect } from '@/adapters/Querys'
import Button, { IconButton } from '@/components/base/Buttons'
import Col, { Container, Row, Rows } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Table from '@/components/base/Table'
import { Card_Persona_Small } from '@/components/Cards'
import MainLayout from '@/components/layout/MainLayout'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'


const Page = ({ session }) => {
	const router = useRouter();

	const [sort, setSort] = useState('createdAt');
	const [order, setOrder] = useState('desc');

	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({});

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
			id: 'id',
			label: 'Transacción',
			type: 'id',
			getContent: (e) => e.transactionId,
		},
		{
			id: 'concept',
			label: 'Concepto',
			type: 'text',
			getContent: (e) => e.concept,
			isSortable: false,
		},
		{
			id: 'providerAccountName',
			label: 'Cuenta',
			type: 'text',
			getContent: (e) => e.providerAccountName,
			isSortable: false,
		},
		{
			id: 'providerAccountNumber',
			label: 'Cuenta Número',
			type: 'text',
			getContent: (e) => e.providerAccountNumber,
			isSortable: false,
		},
		{
			id: 'personName',
			label: 'Persona',
			type: 'text',
			getContent: (e) => e.personName,
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
			id: 'fee',
			label: 'Total',
			type: 'text',
			getContent: (e) => {
				let total = e.total - ((e.total / 100) * e.fee )
				let value = parseMoney(total)
				return value;
			},
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

	const queryFullData = MovDetails_queryData();
	let viewId = router?.query?.viewId;
	let viewType = router?.query?.viewType || 'Depósitos';

	return (
		<>
			<article className="contentSet">

				<div className="contentSet__shrink">
					{/* FILTERS */}
					<AdvancedFilters session={session} onFilter={setFilters} />
				</div>

				<div className="contentSet__scrollable">
					<Container size='fluid'>
						<QueryContent
							id={"movimientoSearch"}
							queryData={{
								size: 20,
								sort: sort,
								order: order,
								...filters
							}}
							hasPagination
							session={session}
							// emptyContent={<NoResults />}
							content={(data, queryData) => {
								let items = data.data;
								return (
									<Table striped={false} lined={true}
										tableData={items}
										tableHead={tableHead}
										isTableActionsCompressed={false}
										tableActions={[
											{
												label: 'Ver detalle',
												icon: 'file',
												makeLink: (e) => '?viewId=' + e.transactionId + '&viewType=' + parseDtype(e.transactionDtype, true)
											}
										]}
										queryData={queryData}
										// isSortable={false}
										onSort={(e) => {
											setOrder(e.order);
											setSort(e.sort);
										}}
									/>
								)
							}}
						/>
					</Container>
				</div>

				<div className="--big">
					<Modal
						title={viewId ? 'Detalle de ' + queryFullData[viewType]?.singular : ' '}
						display={router.query.viewId && router.query.viewType}
						cancelIsClose
						overlayIsCancel
						cancel={{
							text: 'Cancelar',
							handler: () => { router.push('?', { shallow: true }) }
						}}
						body={router.query.viewId && router.query.viewType ?
							<QueryContent id={queryFullData[viewType]?.id && queryFullData[viewType].id.replace('Search', 'Get')} session={session}
								queryData={viewId}
								content={(data) => {
									return queryFullData[viewType]?.detailBody(data);
								}}
							/>
							:
							<div></div>
						}
					/>
				</div>

			</article>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Movimientos',
	// actionLink: '/envios/nuevo',
}
export default Page

// PAGE FILTERS
function AdvancedFilters({ session, onFilter = () => null }) {
	const [client, setClient] = useState(null);
	const [provider, setProvider] = useState(null);
	const [providersAccounts, setProvidersAccounts] = useState([]);
	const router = useRouter();
	const [form, setForm] = useState({
		from: new Date(),
		to: null,
	})
	const [internalFilters, setInternalFilters] = useState({});

	useEffect(() => {
		setInternalFilters({
			personId: provider?.id || client?.id,
			personType: provider ? 'Proveedor' : 'Cliente',
			personName: provider?.name || client?.name,
			providerAccountId: providersAccounts,
			from: forceTime(form?.from, true),
			to: forceTime(form?.to, false),
		})
		onFilter({
			personId: provider?.id || client?.id,
			from: forceTime(form?.from, true),
			to: forceTime(form?.to, false),
			providerAccountId: providersAccounts
		})
		console.log(forceTime(form?.from, true))
	}, [provider, client, providersAccounts, form])

	const mutationGetC = useMutation(formData => {
		return axios(getQueryFullData('clientGet', formData, session))
	}, {
		onSuccess: (data) => {
			setClient(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutationGetP = useMutation(formData => {
		return axios(getQueryFullData('providerGet', formData, session))
	}, {
		onSuccess: (data) => {
			setProvider(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutationGetPA = useMutation(formData => {
		return axios(getQueryFullData('providerAccountGet', formData, session))
	}, {
		onSuccess: (data) => {
		//	setProviderAccount(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	useEffect(() => {
		if (router.query?.clienteId > 0) {
			mutationGetC.mutate(router.query?.clienteId);
		} else {
			client && setClient(null);
		}

		if (router.query?.proveedorId > 0) {
			mutationGetP.mutate(router.query?.proveedorId);
		} else {
			provider && setProvider(null);
		}

		if (router.query?.cuentaProveedorId > 0) {
			mutationGetPA.mutate(router.query?.cuentaProveedorId);
		} else {
			providersAccounts && setProvidersAccounts([]);
		}

	}, [router])

	const inputProps = {
		onChange: (e) => setForm({ ...form, [e.name]: e.value })
	}

	let url = Object.keys(internalFilters).map(function (k) {
		if (internalFilters[k]) {
			return encodeURIComponent(k) + '=' + encodeURIComponent(internalFilters[k])
		}
	}).join('&');

	return (
		<div className="flex gap-3 justify-between">
			<div className='flex gap-3 w-full'>
				<div>
					<label htmlFor="from" className='input__label'>Fecha</label>
					<div className='flex gap-2 items-center'>
						<div className='w-40'>
							<Input type='date' name="from" value={form.from} maxDate={form.to} {...inputProps} />
						</div>
						<p>a</p>
						<div className='w-40'>
							<Input type='date' name="to" value={form.to} minDate={form.from} {...inputProps} />
						</div>
						{form.from || form.to ?
							<IconButton glyph='close' size='md' type='light' variant='link'
								onClick={() => setForm({
									from: null,
									to: null,
								})}
							/>
							:
							null
						}
					</div>
				</div>
				<div className='w-full'>
					<QueryAutocomplete label="Cliente" id="clientSearch" session={session}
						queryData={{
							sort: 'name',
							order: 'asc',
						}}
						value={client}
						getOptionLabel={(option) => option.name}
						onSelect={(selection) => {
							setClient(selection);
							selection && setProvider(null) && setProvidersAccounts([]);
							selection && router.push('?clienteId=' + selection.id);
							!selection && router.push('?', { shallow: true });
						}}
					/>
				</div>
				<div className='w-full'>
					<QueryAutocomplete label="Proveedor" id="providerSearch" session={session}
						queryData={{
							sort: 'name',
							order: 'asc',
						}}
						value={provider}
						getOptionLabel={(option) => option.name}
						onSelect={(selection) => {
							setProvider(selection);
							selection && setClient(null) && setSProviderAccountS([]);
							selection && router.push('?proveedorId=' + selection.id);
							!selection && router.push('?', { shallow: true });
						}}
					/>
				</div>				
				<div className='w-full'>
					<QueryMultipleSelect label="Cuenta" id="providerAccountsSearch" session={session}
							queryData={{
								sort: 'providerId',
								order: 'asc',
							}}
							value={providersAccounts}
							getOptionValue={(option) => option.id}
							getOptionLabel={(option) => option.providerName + ' - '+option.name + ' - #' + option.accountNumber}
							onSelect={(selection) => {
								console.log(selection)
								setProvidersAccounts(selection);								
								selection && setClient(null) && setProvider(null);
								//selection && router.push('?cuentaProveedorId=' + selection);
								!selection && router.push('?', { shallow: true });
							}}
						/>
				</div>
			</div>
			<div>
				<label htmlFor="" className='input__label opacity-0'>-</label>
				<Link href={"/movimientos/detalle?" + url}>
					<a>
						<Button type='success' iconStart='file' className='h-7'>Exportar</Button>
					</a>
				</Link>
			</div>
		</div>
	)
}

// MOV DETALLE MODALS
export function MovDetails_queryData() {
	return {
		'Todos': {
			id: 'transactionSearch',
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
					id: 'dtype',
					label: 'Tipo',
					type: 'text',
					getContent: (e) => parseDtype(e.dtype),
				},
				{
					id: 'personName',
					label: 'Cliente',
					type: 'text',
					getContent: (e) => e.personName,
				},
				{
					id: 'total',
					label: 'Monto',
					type: 'money',
					getContent: (e) => e.total,
				},
			],
			tableActions: [
				{
					label: 'Ver detalle',
					icon: 'file',
					makeLink: (e) => '?viewId=' + e.id + '&viewType=' + parseDtype(e.dtype, true)
				},
				{
					label: 'Exportar PDF',
					icon: 'fileexport',
					makeLink: (e) => '/transacciones/detalle/' + parseDtype(e.dtype, true, true) + '/' + e.id
				}
			],
		},
		'Depósitos': {
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
				{
					id: 'cuit',
					label: 'CUIT',
					type: 'text',
					getContent: (e) => e.cuit,
				},
				{
					id: 'status',
					label: 'Estado',
					type: 'text',
					getContent: (e) => parseStatus(e.status),
				},
				{
					id: 'total',
					label: 'Monto',
					type: 'money',
					getContent: (e) => e.total,
				},

			],
			tableActions: [
				{
					label: 'Ver detalle',
					icon: 'file',
					makeLink: (e) => '?viewId=' + e.id + '&viewType=' + 'Depósitos'
				},
				{
					label: 'Exportar PDF',
					icon: 'fileexport',
					makeLink: (e) => '/transacciones/detalle/' + 'depositos' + '/' + e.id
				},
				{
					isDivider: true
				},
				{
					label: 'Modificar Estado: Ingresado',
					icon: 'arrow',
					handler: (e) => mutation.mutate({ ...e, status: 'INGRESADO' }),
				},
				{
					label: 'Modificar Estado: Confirmado',
					icon: 'arrow',
					handler: (e) => mutation.mutate({ ...e, status: 'CONFIRMADO' }),
				},
				{
					label: 'Modificar Estado: Rechazado',
					icon: 'arrow',
					handler: (e) => mutation.mutate({ ...e, status: 'RECHAZADO' }),
				},
				{
					label: 'Modificar Estado: Error de Carga',
					icon: 'arrow',
					handler: (e) => mutation.mutate({ ...e, status: 'ERROR_DE_CARGA' }),
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
									<p>{parseStatus(data.status, true)}</p>
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
					{data.ticket.file  ?
						<div className="mt-4">
							{data.ticket.file.indexOf('data:image') > -1 ?
								<div className="file-iframe"><img src={data.ticket.file} /></div>
								:
								<iframe src={data.ticket.file} className="file-iframe" />
							}
						</div>
						:
						<p className='my-8 text-center italic'>Sin Comprobante</p>
					}
				</div>
			}
		},
		'Retiros': {
			singular: 'Retiro',
			id: 'retiroSearch',
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
					id: 'paymentIntentionId',
					label: 'Nro. Envío',
					type: 'number',
					getContent: (e) => e.paymentIntentionId ? '#' + e.paymentIntentionId : '-',
				},
				{
					id: 'total',
					label: 'Monto',
					type: 'money',
					getContent: (e) => e.total,
				},

			],
			tableActions: [
				{
					label: 'Ver detalle',
					icon: 'file',
					makeLink: (e) => '?viewId=' + e.id + '&viewType=' + 'Retiros'
				},
				{
					label: 'Exportar PDF',
					icon: 'fileexport',
					makeLink: (e) => '/transacciones/detalle/' + 'retiros' + '/' + e.id
				}
			],
			detailBody: (data) => {
				return <div className='text-left'>
					<Rows cols={4}>
						<Row>
							<Col span={2}>
								<Card_Persona_Small
									title={data.customer?.name}
								/>
							</Col>
							<Col span={2}>
								{data.paymentIntention ? <Card_Persona_Small glyph="exchange"
									title={'#' + data.paymentIntention?.id}
									pretitle={data.paymentIntention?.receiverName + ' (' + data.paymentIntention?.receiverDocument + ')'}
								/>
									:
									<Card_Persona_Small glyph="exchange"
										pretitle='Sin envío'
									/>
								}
							</Col>
						</Row>
						<Row>
							<Col>
								<div className="dataSet">
									<p className='dataSet__title'>Fecha</p>
									<p>{parseDatetime(data.createdAt)}</p>
								</div>
							</Col>
							<Col>
								<div className="dataSet">
									<p className='dataSet__title'>Tipo</p>
									<p>Retiro</p>
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
									<p className='dataSet__title'>Pagado</p>
									<p>{data.paymentIntention?.payed ? 'Si' : 'No'}</p>
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
				</div>
			}
		},
		'Pagos Proveedores': {
			singular: 'Pago Proveedor',
			id: 'pagoProveedorSearch',
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
				// {
				// 	id: 'customerName',
				// 	label: 'Cliente',
				// 	type: 'text',
				// 	getContent: (e) => e.customerName,
				// },
				{
					id: 'providerName',
					label: 'Proveedor',
					type: 'text',
					getContent: (e) => e.providerName,
				},
				{
					id: 'total',
					label: 'Monto',
					type: 'money',
					getContent: (e) => e.total,
				},

			],
			tableActions: [
				{
					label: 'Ver detalle',
					icon: 'file',
					makeLink: (e) => '?viewId=' + e.id + '&viewType=' + 'Pagos Proveedores'
				},
				{
					label: 'Exportar PDF',
					icon: 'fileexport',
					makeLink: (e) => '/transacciones/detalle/' + 'pagoProveedor' + '/' + e.id
				}
			],
			detailBody: (data) => {
				return <div className='text-left'>
					<Rows cols={4}>
						<Row>
							<Col span={2}>
								<Card_Persona_Small
									title={data.provider.name}
								/>
							</Col>
						</Row>
						<Row cols={3}>
							<Col>
								<div className="dataSet">
									<p className='dataSet__title'>Fecha</p>
									<p>{parseDatetime(data.createdAt)}</p>
								</div>
							</Col>
							<Col>
								<div className="dataSet">
									<p className='dataSet__title'>Tipo</p>
									<p>Devolución</p>
								</div>
							</Col>
							<Col>
								<div className="dataSet">
									<p className='dataSet__title'>Monto</p>
									<p>{parseMoney(data.total)}</p>
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
				</div>
			}
		},
	}
}
