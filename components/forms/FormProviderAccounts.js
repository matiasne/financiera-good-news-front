import { getQueryFullData } from '@/adapters/Querys'
import Button, { IconButton } from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Spinner from '@/components/base/Spinner'
import { Card_Persona_Small } from '@/components/Cards'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import Icon from '../base/Icons'
import NoResults from '../base/NoResults'


const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [errors, setErrors] = useState();
	const [accountsTotal, setAccountsTotal] = useState(3);
	const [accounts, setAccounts] = useState([]);
	const [form, setForm] = useState({
		id: null,
	})
	const [proveedor, setProveedor] = useState({});

	const mutationGet = useMutation(formData => {
		return axios(getQueryFullData('providerGet', formData, session));
	}, {
		mutationKey: ['clientGet', form.id],
		onSuccess: (data, variables, context) => {
			// console.log(data);
			setProveedor(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutationGet2 = useMutation(formData => {
		let newFormData = {
			providerId: formData,
			sort: 'accountNumber',
			order: 'asc'
		}
		return axios(getQueryFullData('providerAccountsSearch', newFormData, session)).then((data) => data.data)
	}, {
		mutationKey: ['clientGet', form.id],
		onSuccess: (data, variables, context) => {
			setAccounts(data.data);
			if (data.data && data.data.length > accountsTotal) setAccountsTotal(data.data.length);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutation = useMutation(formData => {
		let newFormData = {
			providerId: form.id,
			accounts: accounts
		}
		return axios(getQueryFullData('providerAccountsUpdate', newFormData, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			setConfirming(false);
			toast.error('Ocurrió un error');
		},
		onSuccess: (data, variables, context) => {
			toast.success('Cuentas de proveedor actualizadas');
			router.back();
		},
		onSettled: () => {
			setConfirming(false);
		},
	})

	useEffect(() => {
		if (router.isReady && router.query.proveedorId) {
			let proveedorId = router.query.proveedorId;
			setForm({ id: parseInt(proveedorId) });
			mutationGet.mutate(proveedorId);
			mutationGet2.mutate(proveedorId);
		}
	}, [router])


	function handleAddAccount(e) {
		e.preventDefault();
		setAccountsTotal(accountsTotal + 1)
	}

	function handleChangeAccount(e, i) {
		let newAccounts = accounts;
		newAccounts[i] = e;
		console.log(newAccounts);
		setAccounts(newAccounts);
	}

	function handleDeleteAccount(internalId) {
		// TODO HERE!!
		setAccountsTotal(accountsTotal - 1);
		console.log(internalId);
		if (internalId <= accounts.length) {
			let newAccounts = accounts.splice(internalId, 1);
			setAccounts(newAccounts)
			console.log(newAccounts);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		setConfirming(true);

		console.log({
			providerId: form.id,
			accounts: accounts
		});
	}

	const handleCancel = (e) => {
		e.preventDefault();
		router.back();
	};

	if (mutationGet.isLoading || mutationGet2.isLoading) {
		return <div className="flex justify-center items-center h-full">
			<Spinner />
		</div>
	}

	return (
		<article className="contentScrollable">

			<Container size="fluid" className="">

				<form className="py-8" onSubmit={handleSubmit}>
					<Row cols={2} gap={5} verticalGap >
						<Col span={2}>
							<Container size="sm">
								<label className="input__label">Proveedor</label>
								<Card_Persona_Small title={proveedor.name} pretitle={'ID: ' + proveedor.id} />
							</Container>
						</Col>
						<Col span={2}>
							{/* <div className="flex flex-col gap-2"> */}
							{/* <TransitionGroup component={React.Fragment}>
								</TransitionGroup> */}
							{/* <CSSTransition timeout={300} key={accounts[i]} classNames="fade">
									</CSSTransition> */}
							<div className="grid gap-2" style={{
								gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr 1fr 6rem 3rem'
								// # Nombre CBU Banco Tipo Cupo Fee X
							}}>
								{[...Array(accountsTotal).keys()].map((i) => {
									return (
										<InputsCuenta
											key={i}
											internalId={i}
											isFirst={i === 0}
											data={accounts[i]}
											onDelete={handleDeleteAccount}
											onChange={(e) => handleChangeAccount(e, i)} />
									)
								})}
							</div>
							{accountsTotal === 0 && <NoResults text="Aún no hay cuentas asociadas al cliente..." />}

							<div className="text-center mt-2">
								<IconButton glyph="plus" type="light" variant="outline" isFilled onClick={handleAddAccount} />
							</div>
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
				title={'Editar Cuentas Proveedor'}
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


function InputsCuenta({
	isFirst = false,
	data = {
		accountNumber: "",
		name: "",
		cbu: "",
		bank: "",
		type: "",
		quota: "",
		fee: "",
	},
	errors,
	onDelete,
	onChange,
	internalId,
	...props
}) {

	const [form, setForm] = useState(data)
	const typeOptions = ['Caja de Ahorro', 'Cuenta Corriente', 'Cuenta Sueldo'];
	const initialData = {
		accountNumber: "",
		cbu: "",
		bank: "",
		type: "",
		cupo: "",
		fee: "",
	};

	function handleInput(e) {
		let newForm = form;
		newForm[e.name] = e.value;
		setForm({ ...newForm, [e.name]: e.value });
		onChange && onChange(newForm);
	}

	let inputProps = {
		errors: errors,
		onChange: handleInput
	}

	function deleteAccount(e) {
		e.preventDefault();
		setForm(initialData)
		onDelete && onDelete(internalId);
	}

	return (
		<>
			<div>
				<Input type="text" label={isFirst && "Nro. Cuenta"} prefix="#" name="accountNumber" value={form.accountNumber || ""} {...inputProps} />
			</div>
			<div>
				<Input type="text" label={isFirst && "Nombre"} name="name" value={form.name || ""} {...inputProps} />
			</div>
			<div>
				<Input type="text" label={isFirst && "CBU"} name="cbu" value={form.cbu || ""} {...inputProps} />
			</div>
			<div>
				<Input type="text" label={isFirst && "Banco"} name="bank" value={form.bank || ""} {...inputProps} />
			</div>
			<div>
				<Input type="select" label={isFirst && "Tipo"} name="type" value={form.type || ""} options={typeOptions} {...inputProps} />
			</div>
			<div>
				<Input type="number" label={isFirst && "Cupo"} name="quota" value={form.quota || ""} {...inputProps} />
			</div>
			<div>
				<Input type="number" label={isFirst && "Comisión"} sufix="%" name="fee" value={form.fee || ""} {...inputProps} />
			</div>
			<div>
				{isFirst && <label className="input__label opacity-0">-</label>}
				<IconButton glyph="delete" type="light" variant="link" onClick={deleteAccount} />
			</div>
		</>
	)
}
