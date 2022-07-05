import { parseMoney } from '@/adapters/Parsers'
import { getQueryFullData, QueryAutocomplete } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Spinner from '@/components/base/Spinner'
import { Card_Persona_Small } from '@/components/Cards'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'


const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [errors, setErrors] = useState(null);
	const [client, setClient] = useState(null);
	const [providerAccount, setProviderAccount] = useState();
	const [form, setForm] = useState({
		id: null,
		total: '',
	})

	// SUBMIT QUERY
	const mutation = useMutation(formData => {
		let newForm = {
			receiverDocument: form.receiverDocument,
			receiverName: form.receiverName,
			total: form.total,
			customerId: client.id,
		}
		return axios(getQueryFullData('envioCreate', newForm, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			setConfirming(false);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			const msg = 'Envío creado con éxtio';
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
								onSelect={(selection) => { selection && setClient(selection); }}
							/>
							<div className="mt-2 mb-3">
								<Card_Persona_Small title={client ? client.name : <span className="placeholder">Nombre</span>} postitle={client ? 'Saldo: ' + parseMoney(client.balance) : <span className="placeholder">123456</span>} />
							</div>

							<Input type="money" label="Monto" name="total" value={form.total} {...inputProps} />
						</Col>
						<Col>
							{/* DESTINATARIO */}
							<label htmlFor="" className="input__label">Destinatario</label>
							<div className='card --flat p-3'>
								{/* <div className='flex justify-between items-center mb-3'>
									<p className='m-0'><strong>ID: -</strong></p>
									<Button size="sm" type='success' iconEnd="plus">Nuevo</Button>
								</div> */}
								<Row cols={2} verticalGap>
									<Col span={2}>
										<Input type="dni" name="receiverDocument" label="DNI" value={form.receiverDocument} {...inputProps} />
									</Col>
									<Col span={2}>
										<Input type="text" name="receiverName" label="Nombre" value={form.receiverName} {...inputProps} />
									</Col>
									{/* <Col>
										<Input type="select" name="sexo" label="Sexo" options={['M', 'F', 'Otro']} value={form.sex} {...inputProps} />
									</Col> */}
								</Row>
							</div>
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
				title={form.id > 0 ? 'Editar Envío' : 'Nuevo Envío'}
				description={'¿Confirma que desea realizar esta acción?'}
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

		</article>
	)
}

export default Form
