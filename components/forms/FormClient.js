import { getQueryFullData } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Spinner from '@/components/base/Spinner'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'


const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [errors, setErrors] = useState()
	const [form, setForm] = useState({
		id: null,
		name: "",
		phone: "",
		email: "",
		address: ""
	})

	const mutationGet = useMutation(formData => {
		return axios(getQueryFullData('clientGet', formData, session))
	}, {
		onSuccess: (data) => {
			console.log(data);
			setForm(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutation = useMutation(res => {
		return axios(getQueryFullData(!form.id ? 'clientCreate' : 'clientUpdate', form, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			setConfirming(false);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			const msg = !form.id ? 'Cliente creado con éxtio' : 'Cliente actualizado';
			toast.success(msg);
			router.back();
		},
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
			<Container size="sm">

				<form className="py-8" onSubmit={handleSubmit}>
					{/* {mutation.isError && <div className="alert bg-red-300 bg-opacity-50 rounded-md p-2 mb-4 flex gap-2 items-center">
							<Icon glyph="info" className="text-icon-sm text-red" />
							<p className="m-0 text-red-600 text-sm">{mutation.error.toString()}</p>
						</div>} */}
					<Row cols={2} gap={5} verticalGap >
						<Col>
							<Input type="text" label="Nombre y Apellido" name="name" value={form.name} {...inputProps} />
						</Col>
						<Col>
							<Input type="email" label="Email" name="email" value={form.email} {...inputProps} />
						</Col>
						<Col>
							<Input type="phone" label="Teléfono" name="phone" value={form.phone} {...inputProps} />
						</Col>
						<Col>
							<Input type="text" label="Direción" name="address" value={form.address} {...inputProps} />
						</Col>
						{/* <Col span={2}>
								<Input type="textarea" label="Notas" name="notes" />
							</Col> */}
					</Row>

					<div className="mt-6 flex gap-3 justify-center">
						<Button size="lg" variant="success">Confirmar</Button>
						<Button size="lg" variant="neutraldark" onClick={handleCancel}>Cancelar</Button>
					</div>
				</form>
			</Container>

			<Modal
				display={isConfirming}
				title={form.id > 0 ? 'Editar Cliente' : 'Nuevo Cliente'}
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
