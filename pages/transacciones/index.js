import { forceTime, getToday, parseDatetime, parseDtype, parseMoney, parseStatus } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData, QueryAutocomplete } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Col, { Container, Row, Rows } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Table from '@/components/base/Table'
import { Card_Persona_Small } from '@/components/Cards'
import MainLayout from '@/components/layout/MainLayout'
import axios from 'axios'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { PillSwitcher } from 'react-pill-switcher'
import { useMutation } from 'react-query'
import { CSSTransition, SwitchTransition } from "react-transition-group"

const Page = ({ role, session }) => {
	const router = useRouter();
	const [pillValue, setPillValue] = useState(role === 'EDITOR' ? 'Depósitos' : 'Todos');
	const [forceRefetch, setForceRefetch] = useState(0);

	const [sort, setSort] = useState('createdAt');
	const [order, setOrder] = useState('desc');
	const [deleteId, setDeleteId] = useState(0);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({});

	const queryFullData = MovDetails_queryData();

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

	const mutation = useMutation(formData => {
		return axios(getQueryFullData('depositoUpdate', formData, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			const msg = 'Depósito Actualizado: ' + parseStatus(data.data.status);
			toast.success(msg);
			// router.back();
			setForceRefetch(forceRefetch + 1);
		},
		onSettled: (data) => {
			// setSelectedTransaction(null)
		}
	})

	let viewId = router?.query?.viewId;
	let viewType = router?.query?.viewType || 'Retiros';

	// MOV DETALLE MODALS
	function MovDetails_queryData() {
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
						type: 'html',
						getContent: (e) => parseStatus(e.status,true),
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
						handler: (e) => router.push('?viewId=' + e.id + '&viewType=' + 'Depósitos')
					},
					{
						label: 'Exportar PDF',
						icon: 'fileexport',
						handler: (e) => router.push('/transacciones/detalle/' + 'depositos' + '/' + e.id)
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
					{
						label: 'Modificar Estado: CUIT Incorrecto',
						icon: 'arrow',
						handler: (e) => mutation.mutate({ ...e, status: 'CUIT_INCORRECTO' }),
					},
					{
						label: 'Modificar Estado: Pendiente de Acreditación',
						icon: 'arrow',
						handler: (e) => mutation.mutate({ ...e, status: 'PENDIENTE_DE_ACREDITACION' }),
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

	useEffect(() => {
		pillValue === 'Depósitos' ? setSort('total') : setSort('createdAt')
	}, [pillValue])

	return (
		<>
			<article className="contentSet">

				{/* FILTERS */}
				<div className="contentSet__shrink">
					<div className="flex gap-3 justify-between">
						{role === 'EDITOR' ?
							<div></div>
							:
							<PillSwitcher name="filters" options={['Todos', 'Depósitos', 'Retiros', 'Pagos Proveedores']} onChange={(e) => { setPillValue(e); setSort('createdAt'); setOrder('desc'); }} />
						}
						<div className="">
							<Button type='light' variant='outline' isFilled iconStart="filters" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</Button>
						</div>
					</div>
				</div>

				{/* ALL FILTERS */}
				<div className={classNames("contentSet__shrink", { 'hidden': !showFilters })}>
					<AdvancedFilters session={session} onFilter={setFilters} pillValue={pillValue} />
				</div>

				<div className="contentSet__scrollable">
					<Container>
						<SwitchTransition>
							<CSSTransition
								key={pillValue}
								addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
								classNames='fade'
							>

								<QueryContent
									id={queryFullData[pillValue].id}
									queryData={{
										size: 20,
										sort: sort,
										order: order,
										forceRefetch: forceRefetch,
										...filters
									}}
									hasPagination
									session={session}
									// loadWhenUpdating
									content={(data, queryData) => {
										let items = data.data;
										return <div>
											<Table striped={false} lined={true}
												tableData={items}
												queryData={queryData}
												onSort={(e) => {
													setOrder(e.order);
													setSort(e.sort);
												}}
												tableHead={queryFullData[pillValue].tableHead}
												tableActions={
													role === 'ADMIN' ?
														queryFullData[pillValue].tableActions
														:
														[queryFullData[pillValue].tableActions[0], queryFullData[pillValue].tableActions[1], queryFullData[pillValue].tableActions[2], queryFullData[pillValue].tableActions[6]]
												}
												isTableActionsCompressed={pillValue === 'Depósitos' ? true : false}
											// trLink={queryFullData[pillValue].trLink}
											/>
										</div>
									}}
								/>
							</CSSTransition>
						</SwitchTransition>
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

				{/* <Modal
					title={'Cambiar Estado'}
					display={selectedTransaction}
					cancelIsClose
					// overlayIsCancel
					cancel={{
						text: 'Cancelar',
						handler: () => { setSelectedTransaction(null) }
					}}
					body={<form onSubmit={() => mutation.mutate()}>
						<Input name="status" type='select' label="Estado" value={selectedTransaction?.status} onChange={(e) => setSelectedTransaction({ status: e.value, ...selectedTransaction })}
							options={[
								{
									value: 'INGRESADO',
									label: 'Ingresado'
								},
								{
									value: 'CONFIRMADO',
									label: 'Confirmado'
								},

								{
									value: 'RECHAZADO',
									label: 'Rechazado'
								},
								{
									value: 'ERROR_DE_CARGA',
									label: 'Error de Carga'
								},
							]}
						/>
						<div className="mt-6 flex gap-3 justify-center">
							<Button size="lg" variant="success">Confirmar</Button>
							<Button size="lg" variant="neutraldark" onClick={(e) => { e.preventDefault(); setSelectedTransaction(null); }}>Cancelar</Button>
						</div>
					</form>
					}
				/> */}

			</article>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Transacciones',
	actionMenu: [
		{
			label: 'Nuevo Depósito',
			icon: 'plus',
			link: '/transacciones/nuevo/deposito',
		},
		{
			label: 'Nuevo Retiro',
			icon: 'plus',
			link: '/transacciones/nuevo/retiro',
			lockEditor: true,
		},
		{
			label: 'Nuevo Pago Proveedor',
			icon: 'plus',
			link: '/transacciones/nuevo/pagoProveedor',
			lockEditor: true,
		},
	]
}
export default Page

// PAGE FILTERS
export function AdvancedFilters({ session, onFilter = () => null, pillValue, startFromToday = false }) {
	const [client, setClient] = useState(null);
	const [provider, setProvider] = useState(null);
	const [providerAccount, setProviderAccount] = useState(null);
	const formik = useFormik({
		initialValues: {
			from: null,
			to: null,
			// montoDesde: '',
			// montoHasta: '',
			customerId: '',
			providerId: '',
			providerAccountId: '',
			total: '',
			internalId: null,
			dtype: '',
			status: ['INGRESADO', 'CUIT_INCORRECTO', 'PENDIENTE_DE_ACREDITACION'],
		},
		onSubmit: (values) => {
			let newStatus = values.status;
			if (values.status[0] === "") newStatus = [];
			onFilter({
				...values,
				status: newStatus,
				from: forceTime(values.from, true),
				to: forceTime(values.to, false),
			});
		},
	})

	function handleReset(e) {
		formik.resetForm();
		formik.submitForm();
		setClient(null);
		setProvider(null);
		setProviderAccount(null);
		// console.log(formik.values);
	}

	useEffect(() => {
		if (startFromToday) {
			formik.setFieldValue('from', getToday());
		}
		formik.submitForm();
	}, [])

	// useEffect(() => {
	// 	setClient(null);
	// 	setProvider(null);
	// 	setProviderAccount(null);
	// 	formik.setFieldValue('customerId', '');
	// 	formik.setFieldValue('providerId', '');
	// 	formik.setFieldValue('providerAccountId', '');
	// 	formik.submitForm();
	// }, [pillValue])

	return (
		<div className="card --flat p-3">
			<Rows gap={5}>
				<Row>
					<Col grow>
						<h6 className='text-h6 font-bold text-gray-600'>Filtrar:</h6>
					</Col>
					<Col auto>
						<div className="flex gap-2">
							<Button type='success' isElevated={false} size='sm' onClick={formik.submitForm}>Filtrar</Button>
							<Button type='neutral' isElevated={false} size='sm' onClick={handleReset}>Limpiar Filtros</Button>
						</div>
					</Col>
				</Row>
				<Row cols={4}>
					<Col>
						<label htmlFor="from" className='input__label'>Fecha</label>
						<Row cols={2} gap={1}>
							<Col grow>
								<Input type="date" name="from" value={formik.values.from} maxDate={formik.values.to} onChange={(e) => formik.setFieldValue('from', e.value)} />
							</Col>
							<Col auto><p className='pt-1'>a</p></Col>
							<Col grow>
								<Input type="date" name="to" value={formik.values.to} minDate={formik.values.from} onChange={(e) => formik.setFieldValue('to', e.value)} />
							</Col>
						</Row>
					</Col>
					<Col>
						<Input type="money" name="total" label="Monto" value={formik.values.total} onChange={(e) => formik.setFieldValue('total', e.value)} />
					</Col>
					<Col>
						<div className={(pillValue === 'Todos' || pillValue === 'Devoluciones') && "opacity-0 pointer-events-none"}>
							<QueryAutocomplete label="Cliente" id="clientSearch" session={session}
								queryData={{
									sort: 'name',
									order: 'asc',
								}}
								value={client}
								getOptionLabel={(option) => option.name}
								onSelect={(selection) => {
									setClient(selection);
									formik.setFieldValue('customerId', selection?.id || null);
								}}
								disabled={pillValue === 'Todos' || pillValue === 'Devoluciones'}
							/>
						</div>
					</Col>
					<Col>
						<div className={(pillValue === 'Todos' || pillValue === 'Retiros') && "opacity-0 pointer-events-none"}>
							<QueryAutocomplete label="Proveedor" id="providerSearch" session={session}
								queryData={{
									sort: 'name',
									order: 'asc',
								}}
								value={provider}
								getOptionLabel={(option) => option.name}
								onSelect={(selection) => {
									setProvider(selection);
									formik.setFieldValue('providerId', selection?.id || null);
								}}
								disabled={pillValue === 'Todos' || pillValue === 'Retiros'}
							/>
						</div>
					</Col>
					<Col>
						<div className={(pillValue === 'Todos' || pillValue === 'Retiros' || pillValue === 'Pagos Proveedores') && "opacity-0 pointer-events-none"}>
							<QueryAutocomplete label="Cuenta" id="providerAccountsSearch" session={session}
								queryData={{
									sort: 'providerId',
									order: 'asc',
								}}
								value={providerAccount}
								getOptionLabel={(option) => option.name + ' - #' + option.accountNumber}
								groupBy={(option) => option.providerName}
								onSelect={(selection) => {
									setProviderAccount(selection);
									formik.setFieldValue('providerAccountId', selection?.id || null);
								}}
								disabled={pillValue === 'Todos' || pillValue === 'Retiros' || pillValue === 'Pagos Proveedores'}
							/>
						</div>
					</Col>
					<Col>
						<div className={(pillValue !== 'Depósitos') && "opacity-0 pointer-events-none"}>
							<Input type="text" name="internalId" label="Nro. de Comprobante" prefix="#" value={formik.values.internalId} onChange={(e) => formik.setFieldValue('internalId', e.value)} />
						</div>
					</Col>
					<Col span={2}>
						<div className={(pillValue !== 'Depósitos') && "opacity-0 pointer-events-none"}>
							<Input type="multiselect" name="status" label="Estado" value={formik.values.status} onChange={(e) => formik.setFieldValue('status', e.value)}
								options={[
									{
										label: 'Todos',
										value: '',
									},
									{

										label: 'Ingresado',
										value: 'INGRESADO',
									},
									{
										label: 'Confirmado',
										value: 'CONFIRMADO',
									},
									{
										label: 'Rechazado',
										value: 'RECHAZADO',
									},
									{
										label: 'Error de Carga',
										value: 'ERROR_DE_CARGA',
									},
									{
										label: 'CUIT Incorrecto',
										value: 'CUIT_INCORRECTO',
									},
									{
										label: 'Pendiente de Acreditación',
										value: 'PENDIENTE_DE_ACREDITACION',
									},
								]}
							/>
						</div>
					</Col>

				</Row>
			</Rows>
		</div>
	)
}
