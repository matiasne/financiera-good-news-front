import { getTimestamp, parseDatetime, parseMoney, parseTitle } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData, QueryAutocomplete } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Col, { Container, Row, Rows } from '@/components/base/Grid'
import Input, { getInputErrors } from '@/components/base/Inputs'
import Spinner from '@/components/base/Spinner'
import { CardName, Card_Persona_Small } from '@/components/Cards'
import axios from 'axios'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import Table from '@/components/base/Table'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'
import NoResults from '../base/NoResults'
import Icon from '../base/Icons'
import { MovDetails_queryData } from 'pages/movimientos'



const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [isSearchingDepositDuplicate, setSearchingDepositDuplicate] = useState(false);
	const [errors, setErrors] = useState()
	const [client, setClient] = useState(null);
	const [providerAccount, setProviderAccount] = useState(null);
	const [form, setForm] = useState({
		internalId: '',
		file: null,
		total: '',
		customerId: null,
		providerAccountId: [],
		notes: '',
		cuit: '',
	});
	const [forceRefresh, setForceRefresh] = useState(0);

	const mutationGet = useMutation(formData => {
		return axios(getQueryFullData('clientGet', formData, session))
	}, {
		onSuccess: (data) => {
			setClient(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutation = useMutation(res => {
		let newForm = {
			...form,
			customerId: client && client.id,
			providerAccountId: providerAccount && providerAccount.providerAccount.id 
		};

		return axios(getQueryFullData('depositoCreate', newForm, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			const msg = !form.id ? 'Depóstito generado con éxtio' : 'Depóstito actualizado';
			toast.success(msg);
			// router.back();
			setForm({
				internalId: '',
				file: null,
				total: '',
				customerId: client.id,
				providerAccountId: [],
				notes: '',
				cuit: '',
			});
			setClient(null) //just to refresh last deposit list
			setClient({ refresh: getTimestamp(), ...client })
			/*setProviderAccount(null)
			setConfirming(false)
			setErrors(null)*/
			setForceRefresh(forceRefresh + 1);
		},
		onSettled: (data) => {
			setConfirming(false);
		}
	})

	useEffect(() => {
		
		if (router.isReady && router.query.clienteId) {
			mutationGet.mutate(router.query.clienteId);
		}
	}, [router])


	function handleInput(e) {
		setForm({ ...form, [e.name]: e.value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		setConfirming(true);
		if (form.file) {
			var reader = new FileReader();
			reader.readAsDataURL(form.file[0]);
			reader.onload = () => {
				setForm({ ...form, 'file': reader.result });
			};
		}
	}

	const handleCancel = (e) => {
		e.preventDefault();
		router.back();
	};

	let inputProps = {
		errors: errors,
		onChange: handleInput,
	}

	if (mutationGet.isLoading) {
		return <div className="flex justify-center items-center h-full">
			<Spinner />
		</div>
	}

	return (

		<article>
			<div className="contentSet">
				<div className="contentSet__scrollable">
					<Container size="md">

						<form className="py-8" onSubmit={handleSubmit}>
							<Rows cols={6} gap={5}>
								<Row>
									<Col span={3}>
										{/* CLIENTE */}
										<QueryAutocomplete label="Cliente" id="clientSearch" session={session}
											queryData={{
												sort: 'name',
												order: 'asc'
											}}
											value={client}
											getOptionLabel={(option) => option.name}
											onSelect={(selection) => {
												setClient(selection);
												setProviderAccount(null);
											}}
										/>
										<div className="my-2 flex flex-col gap-3">
											<Card_Persona_Small pretitle="-" title={client ? client.name : <span className="placeholder">Nombre</span>} postitle={client ? 'Saldo: ' + parseMoney(client.balance) : <span className="placeholder">123456</span>} errors={errors} errorsName='customerId' />
											<div>
												<label className="input__label">Últimos Depósitos</label>
												{
													client?.id ?
														<div className="withScroll h-96">
															<QueryContent id="depositoSearch" hasPagination={false} session={session}
																queryData={client ? {
																	page: 1,
																	size: 25,
																	sort: 'createdAt',
																	order: 'desc',
																	customerId: client.id,
																	refresh: client.refresh
																} : false}
																content={(data) => {
																	return <Table striped={false} lined={true} isSortable={false}
																		tableData={data.data}
																		tableHead={[
																			{
																				id: 'createdAt',
																				label: 'Fecha',
																				type: 'id',
																				getContent: (e) => parseDatetime(e.createdAt),
																			},
																			{
																				id: 'internalId',
																				label: 'Nro.',
																				type: 'id',
																				getContent: (e) => '#' + e.internalId,
																			},
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
																		]}
																	/>
																}}
															/>
														</div>
														:
														<NoResults text="Seleccione un cliente para ver los depósitos..." />
												}
											</div>
										</div>
									</Col>
									<Col span={3}>
										<Row verticalGap>
											{/* DESTINATARIO */}
											<Col span={12}>
												<QueryAutocomplete label="Cuenta Destino" id="clientcommissionGet" session={session}
													queryData={client ? client.id : false}
													on={client}
													value={providerAccount}
													renderOption={(props, option) => (
														<li {...props} className={classNames(props.className, "px-3 py-2")}>
															<CardName sm glyph="moneybag"
																title={option.providerAccount.name}
																postitle={'#' + option.providerAccount.accountNumber + ' • ' + parseTitle(option.providerAccount.type + ' • ' + option.providerAccount.bank)}
															/>
														</li>
													)}
													getOptionLabel={(option) => '#' + option.providerAccount.accountNumber}
													onSelect={(selection) => { setProviderAccount(selection) }}
												/>
												<div className="my-2 flex flex-col gap-3">
													<Card_Persona_Small
														pretitle={providerAccount ? '#' + providerAccount.providerAccount.accountNumber : <span className="placeholder">132456789</span>}
														title={providerAccount ? providerAccount.providerAccount.name : <span className="placeholder">Nombre Cuenta</span>}
														postitle={providerAccount ? parseTitle(providerAccount.providerAccount.type + ' • ' + providerAccount.providerAccount.bank) + ' • Saldo: ' + parseMoney(providerAccount.providerAccount.balance, true, true) : <span className="placeholder">Saldo y mas data $123456</span>}
														glyph="moneybag" errors={errors}
														errorsName='providerAccountId'
													/>
												</div>
											</Col>

											{/* COMPROBANTE FILE */}
											<Col span={12}>
												<MyDropzone onChange={(files) => { setForm({ ...form, file: files }) }} forceRefresh={forceRefresh} />
												{getInputErrors(inputProps.errors, 'file').errorLables}
												{/* <Input type="file" label="Comprobante" name="file" onChange={(e) => console.log(e.value)} /> */}
											</Col>
										</Row>
									</Col>
								</Row>

								<Row cols={12}>
									{/* MONTO */}
									<Col span={3}>
										<Input type="money" label="Monto" name="total" value={form.total} {...inputProps} />
									</Col>
									{/* CUIT */}
									<Col span={3}>
										<Input type="text" label="CUIT" name="cuit" value={form.cuit} {...inputProps} />
									</Col>
									{/* COMPROBANTE N° */}
									<Col span={6}>
										<div className="flex gap-3">
											<div className="w-full">
												<Input type="text" label="Nro. de Comprobante" name="internalId" prefix="#" value={form.internalId} {...inputProps} />
											</div>
											<div>
												<div className="input__label opacity-0">-</div>
												<Button onClick={(e) => { setSearchingDepositDuplicate(true); e.preventDefault(); }} className="h-7" isElevated={false}>Buscar</Button>
											</div>
										</div>
									</Col>
								</Row>

								<Row>
									<Col span={6}>
										<Input type="textarea" label="Notas" name="notes" value={form.notes} {...inputProps} />
									</Col>
								</Row>
							</Rows>

							<div className="mt-6 flex gap-3 justify-center">
								<Button size="lg" variant="success">Confirmar</Button>
								<Button size="lg" variant="neutraldark" onClick={handleCancel}>Cancelar</Button>
							</div>
						</form>
					</Container>
				</div>
			</div>

			<Modal
				display={isConfirming}
				title={form.id > 0 ? 'Editar Depósito' : 'Nuevo Depósito'}
				description={'¿Confirma que desea realizar esta acción?'}
				isLoading={mutation.isLoading}
				loadingContent={<Spinner />}
				className="text-button font-bold text-gray-500 py-4"
				options={[
					{
						text: 'Aceptar y crear nuevo',
						handler: () => mutation.mutate(),
					}
				]}
				cancel={{
					text: 'Cancelar',
					handler: () => setConfirming(false),
				}}
			/>

			<div className="--big">
				<Modal
					display={isSearchingDepositDuplicate}
					title={'Buscar Ticket'}
					// isLoading={mutationGetDuplicate.isLoading}
					// loadingContent={<Spinner />}
					className="text-button font-bold text-gray-500 py-4"
					cancelIsClose
					cancel={{
						text: 'Cerrar',
						handler: () => setSearchingDepositDuplicate(null),
					}}
					body={
						<QueryContent id="depositoInternalGet" hasPagination={false} session={session}
							queryData={form.internalId}
							retry={1}
							content={(data) => {
								const queryFullData = MovDetails_queryData();
								return queryFullData['Depósitos']?.detailBody(data);
							}}
							errorContent={<div className='my-6'>
									<Icon glyph='success' className={'text-h2 text-green'} />
									<p className='text-center italic m-0'>No se encontraron tickets con el ID <strong>#{form.internalId}</strong></p>
								</div>
							}
						/>
					}
				/>
			</div>

		</article>
	)
}

export default Form


function MyDropzone({ onChange = () => null, forceRefresh = 0 }) {
	const [preview, setPreview] = useState();
	const [myFiles, setMyFiles] = useState([])

	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
		onDrop: files => {
			onChange(files);
			setMyFiles(files);
			setPreview(null);
			var reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = () => {
				setPreview(reader.result);
			};
		}
	});

	useEffect(() => {
		setMyFiles([])
		setPreview(null);
	}, [forceRefresh])

	const files = preview && <li key='preview' className="text-center">
		{preview?.indexOf('image') > -1 ?
			<div className="dropZone__preview" >
				<img src={preview} key={preview} />
			</div>
			:
			<div className='text-h2 text-gray-400 w-full h-full flex justify-center items-center bg-gray-200 rounded-lg mb-1 mx-auto'>
				<Icon glyph='invoice' />
			</div>
		}
		<span><strong>{myFiles[0]?.name}</strong> - {parseInt(myFiles[0]?.size / 1024)} kb</span>
	</li>

	return (
		<div className='input-group'>
			<label htmlFor="" className='input__label'>Comprobante</label>
			<div {...getRootProps()} className="dropZone">
				<input {...getInputProps()} />
				{
					isDragActive ?
						<div className="dropZone__label">
							<div className='dropZone__labelzone'>
								<p className='text-main font-bold'>Suelte los archivos aquí</p>
							</div>
						</div>
						:
						files ?
							<div className="dropZone__label flex gap-1 flex-col">
								<ul>{files}</ul>
							</div>
							:
							<div className="dropZone__label flex gap-1 flex-col justify-center items-center">
								<Button isElevated={false} className='pointer-events-none'>Buscar</Button>
								<p className='text-center'>Sin archivos seleccionados. Busque o arrastre aquí sus archivos.</p>
							</div>
				}

			</div>
		</div>
	)
}
