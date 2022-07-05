import QueryContent, { getQueryFullData, QueryAutocomplete } from '@/adapters/Querys'
import Button, { ButtonGroup } from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Spinner from '@/components/base/Spinner'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { CardName, Card_Persona_Small, Card_Plain } from '@/components/Cards'
import classNames from 'classnames'
import { parseMoney, parseTitle } from '@/adapters/Parsers'


const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [errors, setErrors] = useState(null);
	const [provider, setProvider] = useState(null);
	const [form, setForm] = useState({
		id: null,
		total: '',
	})

	// SUBMIT QUERY
	const mutation = useMutation(formData => {
		let newForm = {
			providerId: provider.id,
			total: parseFloat(form.total),
		}
		return axios(getQueryFullData('pagoProveedorCreate', newForm, session))
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

	const mutationGet = useMutation(formData => {
		return axios(getQueryFullData('providerGet', formData, session))
	}, {
		onSuccess: (data) => {
			setProvider(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	useEffect(() => {
		if (router.query?.proveedorId > 0) {
			mutationGet.mutate(router.query?.proveedorId);
		} else {
			provider && setProvider(null);
		}
	}, [router])


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
							{/* PROVEEDOR */}
							<QueryAutocomplete label="Proveedor" id="providerSearch" session={session}
								queryData={{
									sort: 'name',
									order: 'asc'
								}}
								value={provider}
								getOptionLabel={(option) => option.name}
								onSelect={(selection) => { selection && setProvider(selection); }}
							/>
							<div className="mt-2">
								<Card_Persona_Small title={provider ? provider.name : <span className="placeholder">Nombre</span>} postitle={provider ? 'Saldo: ' + parseMoney(provider.balance) : <span className="placeholder">123456</span>} />
							</div>
						</Col>
						<Col>
							<Input type="money" label="Monto" name="total" value={form.total} {...inputProps} />
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
				title={form.id > 0 ? 'Editar Pago Proveedor' : 'Nuevo Pago Proveedor'}
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
