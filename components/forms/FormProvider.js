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
		social: "",
		email: "",
		phone: "",
		address: "",
		notes: "",
	})

	const mutationGet = useMutation(formData => {
		return axios(getQueryFullData('providerGet', formData, session))
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
		return axios(getQueryFullData(!form.id ? 'providerCreate' : 'providerUpdate', form, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			setConfirming(false);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			const msg = !form.id ? 'Proveedor creado con éxtio' : 'Proveedor actualizado';
			toast.success(msg);
			router.back();
		},
	})

	useEffect(() => {
		if (router.isReady && router.query.proveedorId) {
			mutationGet.mutate(router.query.proveedorId);
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

				<form className="py-8">
					<Row cols={6} gap={5} verticalGap >
						<Col span={3}>
							<Input type="text" label="Nombre o Razón Social" name="name" value={form.name} {...inputProps} />
						</Col>
						<Col span={3}>
							<Input type="email" label="Email" name="email" value={form.email} {...inputProps} />
						</Col>
						<Col span={3}>
							<Input type="phone" label="Teléfono" name="phone" value={form.phone} {...inputProps} />
						</Col>
						<Col span={3}>
							<Input type="text" label="Direción" name="address" value={form.address} {...inputProps} />
						</Col>
						<Col span={6}>
							<Input type="textarea" label="Notas" name="notes" value={form.notes} {...inputProps} />
						</Col>
					</Row>

					<div className="mt-6 flex gap-3 justify-center">
						<Button size="lg" variant="success" onClick={handleSubmit}>Confirmar</Button>
						<Button size="lg" variant="neutraldark" onClick={handleCancel}>Cancelar</Button>
					</div>
				</form>
			</Container>

			<Modal
				display={isConfirming}
				title={form.id > 0 ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
