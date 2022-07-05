import { parseDatetime, parseMoney, parseTitle } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData, QueryAutocomplete } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Col, { Container, Row, Rows } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
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


const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [errors, setErrors] = useState()
	const [trans, setTrans] = useState(null);

	const mutationGet = useMutation(formData => {
		return axios(getQueryFullData('depositoGet', formData, session))
	}, {
		onSuccess: (data) => {
			setTrans(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutation = useMutation(res => {
		let newForm = {
			internalId: router.query.transaccionId,
			status: trans.status
		};

		return axios(getQueryFullData('depositoStatusUpdate', newForm, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			const msg = 'Estado de depósito actualizado';
			toast.success(msg);
			router.back();
		},
		onSettled: (data) => {
			setConfirming(false);
		}
	})

	useEffect(() => {
		if (router.isReady && router.query.transaccionId) {
			mutationGet.mutate(router.query.transaccionId);
		}
	}, [router])


	function handleInput(e) {
		setTrans({ ...trans, [e.name]: e.value });
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

	if (!trans) return <p>No result</p>

	return (
		<article>
			<div className="contentSet">
				<div className="contentSet__scrollable">
					<Container size="md">
						<form className="py-8" onSubmit={handleSubmit}>
							<Rows cols={4}>
								<Row>
									<Col span={2}>
										<label htmlFor="" className="input__label">Cliente</label>
										<Card_Persona_Small title={trans.customer.name} />
									</Col>
									<Col span={2}>
										<label htmlFor="" className="input__label">Cuenta Destino</label>
										<Card_Persona_Small glyph="moneybag"
											title={'#' + trans.providerAccount.accountNumber}
											postitle={trans.providerAccount.provider.name}
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="dataSet">
											<p className='dataSet__title'>Fecha</p>
											<p>{parseDatetime(trans.createdAt)}</p>
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
											<p>{parseMoney(trans.total)}</p>
										</div>
									</Col>
									<Col>
										<div className="dataSet">
											<p className='dataSet__title'>Comprobante</p>
											<p>{'#' + trans.internalId}</p>
										</div>
									</Col>
								</Row>
								<Row>
									<Col></Col>
									<Col span={2}>
										<Input name="status" type='select' label="Estado" value={trans.status} {...inputProps}
											options={[{
												value: 'ENTERED',
												label: 'Ingresado'
											},
											{
												value: 'PENDING',
												label: 'Pendiente'
											},
											{
												value: 'CONFIRMED',
												label: 'Confirmado'
											},
											{
												value: 'REJECTED',
												label: 'Rechazado'
											}
											]}
										/>
									</Col>
									<Col></Col>
									{/* CREDITED, PENDING, REJECTED */}
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
				title={'Actualizar Estado de Depósito'}
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
