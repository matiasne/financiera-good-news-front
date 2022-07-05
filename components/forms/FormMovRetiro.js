import { parseDatetime, parseMoney } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData, QueryAutocomplete } from '@/adapters/Querys'
import Button, { IconButton } from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Spinner from '@/components/base/Spinner'
import Table from '@/components/base/Table'
import { Card_Inputs, Card_Persona_Small } from '@/components/Cards'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Warning } from '../Warnings'


const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [isSearchingEnvio, setSearcisSearchingEnvio] = useState(false);
	const [errors, setErrors] = useState(null);
	const [client, setClient] = useState(null);
	const [envio, setEnvio] = useState();
	const [form, setForm] = useState({
		total: '',
		customerId: 0,
		paymentIntentionId: 0,
		notes: '',
	})

	// SUBMIT QUERY
	const mutation = useMutation(formData => {
		let newForm = {
			total: form.total,
			customerId: client?.id,
			paymentIntentionId: envio?.id,
			notes: form.notes,
		}
		return axios(getQueryFullData('retiroCreate', newForm, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			setConfirming(false);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			const msg = 'Retiro creado con éxtio';
			toast.success(msg);
			router.back();
		},
	})

	useEffect(() => {
		if (router.isReady && router.query.clienteId) {
			mutationGet.mutate(router.query.clienteId);
		}
	}, [router])
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

	function handleSearchEnvio(e) {
		e.preventDefault();
		setSearcisSearchingEnvio(true);
	}


	function handleInput(e) {
		setForm({ ...form, [e.name]: e.value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		setConfirming(true);
	}

	const handleCancel = (e) => {
		e.preventDefault();
		router.back();
	};

	let inputProps = {
		errors: errors,
		onChange: handleInput,
	}

	return (

		<article>
			<Container size="sm">

				<form className="py-8" onSubmit={handleSubmit}>
					{/* {mutation.isError && <div className="alert bg-red-300 bg-opacity-50 rounded-md p-2 mb-4 flex gap-2 items-center">
						<Icon glyph="info" className="text-icon-sm text-red" />
						<p className="m-0 text-red-600 text-sm">{mutation.error.toString()}</p>
					</div>} */}
					<Row cols={2} gap={5} verticalGap >
						<Col>
							{/* CLIENTE */}
							<QueryAutocomplete label="Cliente" id="clientSearch" session={session}
								queryData={{
									sort: 'name',
									order: 'asc'
								}}
								value={client}
								getOptionLabel={(option) => option.name}
								onSelect={(selection) => { setClient(selection); setEnvio(null); setForm({ ...form, total: '' }) }}
							/>
							<div className="mt-4">
								<Card_Persona_Small title={client ? client.name : <span className="placeholder">Nombre</span>} postitle={client ? 'Saldo: ' + parseMoney(client.balance) : <span className="placeholder">123456</span>} errors={errors} errorsName='customerId' />
							</div>
						</Col>
						<Col>
							{/* ENVÍO */}
							<label htmlFor="" className="input__label">Envío</label>
							<Card_Inputs title={envio ? '#' + envio.id : <span className="placeholder">123456</span>} pretitle={envio ? envio.receiverName : <span className="placeholder">123456</span>} glyph="exchange" divider={false} errors={errors} errorsName='paymentIntentionId' >
								<IconButton glyph="search" className="absolute right-1 top-1" variant="light" isElevated={false} onClick={handleSearchEnvio} />
								<Input type="money" label="Monto" name="total" value={form.total} {...inputProps} />
							</Card_Inputs>
						</Col>
						<Col span={2}>
							<Input type="textarea" label="Notas" name="notes" value={form.notes} {...inputProps} />
						</Col>
					</Row>

					<div className="mt-6 flex gap-3 justify-center">
						<Button size="lg" variant="success">Confirmar</Button>
						<Button size="lg" variant="neutraldark" onClick={handleCancel}>Cancelar</Button>
					</div>
				</form>
			</Container>

			<Modal
				display={isConfirming}
				title={form.id > 0 ? 'Editar Retiro' : 'Nuevo Retiro'}
				body={client && parseFloat(form.total) > client.balance ?
					<>
						<Warning>El saldo del cliente supera el monto a entregar</Warning>
						<p>¿Desea concretar la operación dejando el saldo en negativo?</p>
					</>
					:
					<p>¿Confirma que desea realizar esta acción?</p>
				}
				isLoading={mutation.isLoading}
				loadingContent={<Spinner />}
				className="text-button font-bold text-gray-500 py-4"
				options={[
					{
						text: 'Aceptar',
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
					display={isSearchingEnvio}
					title={'Seleccione un Envío'}
					cancelIsClose
					cancel={{
						text: 'Cancelar',
						handler: () => setSearcisSearchingEnvio(false),
					}}
					body={
						<QueryContent id="envioSearch" session={session}
							queryData={{
								page: 1,
								size: 50,
								sort: 'id',
								order: 'asc',
								customerId: client?.id
							}}
							content={(data) => {
								return (<>
									<div className="mb-3 w-60">
										<Input iconStart="search" type="text" name="filter" placeholder="Filtrar..." />
									</div>
									<Table striped={false} lined={true} isSortable={false}
										isSelectable
										selectedItem={envio}
										onSelect={(selection) => { setEnvio(selection); setForm({ ...form, total: selection.total || '' }); setSearcisSearchingEnvio(false); }}
										disableSelect={(item) => item.payed === true}
										tableData={client ? data.data : []}
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
												id: 'customerName',
												label: 'Cliente',
												type: 'text',
												getContent: (e) => e.customerName,
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
									/>
								</>)
							}}
						/>
					}

				/>
			</div>

		</article>
	)
}

export default Form
