import { parseThousands, parseTitle } from '@/adapters/Parsers'
import { getQueryFullData, QueryInfiniteContent, QueryAutocomplete } from '@/adapters/Querys'
import Button, { IconButton } from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Icon from '@/components/base/Icons'
import Input from '@/components/base/Inputs'
import NoResults from '@/components/base/NoResults'
import Spinner from '@/components/base/Spinner'
import { Card_Inputs, Card_Persona_Small, CardName } from '@/components/Cards'
import axios from 'axios'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Modal from 'react-gold-modal'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { CSSTransition, TransitionGroup } from 'react-transition-group';



const Form = ({ session, formData, ...props }) => {
	const router = useRouter();
	const [isConfirming, setConfirming] = useState(false);
	const [errors, setErrors] = useState();
	const [accounts, setAccounts] = useState([]);
	const [client, setClient] = useState({});
	const [form, setForm] = useState({ id: 0 });

	const mutationGet = useMutation(formData => {
		return axios(getQueryFullData('clientGet', formData, session));
	}, {
		mutationKey: ['clientGet', form.id],
		onSuccess: (data, variables, context) => {
			// console.log(data);
			setClient(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutationGet2 = useMutation(formData => {
		return axios(getQueryFullData('clientcommissionGet', formData, session)).then((data) => data.data)
	}, {
		mutationKey: ['clientcommissionGet', form.id],
		onSuccess: (data, variables, context) => {
			let newCommissions = [];
			if (data) {
				data.map((comm, i) => {
					newCommissions.push({
						id: comm.id,
						providerId: comm.providerAccount.provider.name.id,
						providerAccountId: [comm.providerAccount.id],
						providerName: comm.providerAccount.provider.name,
						accountNumber: comm.providerAccount.accountNumber,
						accountName: comm.providerAccount.name,
						// commission: comm.commission,
						providerFee: comm.providerAccount.fee || 0,
						type: comm.providerAccount.type,
						bank: comm.providerAccount.bank,
						fee: comm.fee || 0,
					})
				})
			}
			setAccounts(newCommissions);
		},
		onError: (err) => {
			console.log(err);
		}
	})


	const mutation = useMutation(formData => {
		let newFormData = {
			customerId: form.id,
			commissions: accounts,
		}
		return axios(getQueryFullData('clientcommissionUpdate', newFormData, session))
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
	})

	useEffect(() => {
		if (router.isReady && router.query.clienteId && router.query.clienteId !== form.id ) {
			let clienteId = router.query.clienteId;
			setForm({ id: parseInt(clienteId) });
			mutationGet.mutate(clienteId);
			mutationGet2.mutate(clienteId);
		}
	}, [router])


	function handleAddAccount(selection) {
		if (selection) {
			console.log(selection);
			setAccounts(accounts.concat({
				// id: null,
				providerName: selection.providerName,
				accountNumber: selection.accountNumber,
				accountName: selection.name,
				providerAccountId: [selection.id],
				providerId: selection.providerId,
				fee: 0,
				providerFee: selection.fee,
			}));
		}
	}

	function handleDeleteAccount(internalId) {
		let newAccounts = accounts.filter((acc, i) => acc.id !== internalId);
		setAccounts(newAccounts)
	}

	function handleSubmit(e) {
		e.preventDefault();
		console.log(accounts);
		setConfirming(true);
	}

	const handleCancel = (e) => {
		e.preventDefault();
		router.back();
	};

	function handleInputAccount(e, i) {
		let newAccounts = accounts;
		newAccounts[i] = e;
		setAccounts(newAccounts);
	}


	if (mutationGet.isLoading || mutationGet2.isLoading) {
		return <div className="flex justify-center items-center h-full">
			<Spinner />
		</div>
	}

	return (
		<article className="contentSet">
			<div className="contentSet__scrollable">

				<Container size="sm">
					<form className="py-8" onSubmit={handleSubmit}>
						<Row cols={2} gap={5} verticalGap >
							<Col span={2} >
								<label className="input__label">Cliente</label>
								<Card_Persona_Small title={client.name} pretitle={'ID: ' + client.id} />
							</Col>
							<Col span={2}>
								<QueryAutocomplete id="providerAccountsSearch" session={session}
									placeholder="Escribe para buscar una cuenta..."
									// clearOnSelect
									queryParam="accountNumber"
									getOptionLabel={(option) => option.accountNumber}
									groupBy={(option) => option.providerName}
									getOptionDisabled={(option) => accounts && accounts.filter((acc) => acc.providerAccountId.includes(option.id)).length > 0}
									renderOption={(props, option) => (
										<li {...props} className={classNames(props.className, "px-3 py-2")}>
											<CardName sm glyph="moneybag"
												// title={'#' + option.accountNumber}
												title={option.name + ' - #' + option.accountNumber}
												postitle={parseTitle(option.type + ' • ' + option.bank)}
											/>
										</li>
									)}
									onSelect={handleAddAccount}
									value={null}
								/>
							</Col>
							<Col span={2}>
								<div className="flex flex-col gap-2 mt-2">
									{/* ACA VAN LAS CUENTAS */}
									<TransitionGroup component={React.Fragment}>
										{accounts && accounts.length > 0 && accounts.map((acc, i) => {
											return (
												<CSSTransition key={i} timeout={300} classNames="slideUp">
													<InputsCuenta
														key={acc.id}
														internalId={acc.id}
														data={acc}
														onDelete={handleDeleteAccount}
														onChange={(e) => handleInputAccount(e, i)}
													/>
												</CSSTransition>
											)
										})}
										{!accounts || accounts.length === 0 &&
											<CSSTransition key={'noresult'} timeout={300} classNames="slideUp">
												<NoResults text="No se encontraron cuentas asociadas al cliente." />
											</CSSTransition>
										}
									</TransitionGroup>
								</div>
							</Col>
						</Row>

						<div className="mt-6 flex gap-3 justify-center">
							<Button size="lg" variant="success">Confirmar</Button>
							<Button size="lg" variant="neutraldark" onClick={handleCancel}>Cancelar</Button>
						</div>
					</form>
				</Container>
			</div>

			<Modal
				display={isConfirming}
				title={'Editar Comisiones'}
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
	data = {},
	errors,
	onDelete,
	onChange,
	internalId,
	...props
}) {

	const [form, setForm] = useState(data)

	// useEffect(() => {
	// 	setForm({ ...form, commission: data.commission });
	// }, [data])

	function handleInput(e) {
		let newForm = form;
		newForm[e.name] = e.value;
		setForm({ ...form, [e.name]: e.value });
		onChange && onChange(newForm);
	}

	function deleteAccount(e) {
		e.preventDefault();
		onDelete && onDelete(internalId);
	}

	let inputProps = {
		errors: errors,
		onChange: handleInput
	}

	console.log(data);

	return (
		<Card_Inputs pretitle={form.providerName + ' - #' + form.accountNumber} title={form.accountName} postitle={form.type && form.type + ' • ' + form.bank} glyph="moneybag">
			<IconButton glyph="delete" type="neutral" variant="link" className="text-gray-400 absolute right-2 top-2" onClick={deleteAccount} />
			<Row gap={5} verticalGap>
				<Col grow>
					<label className="input__label">Comision Proveedor</label>
					<p className="input__label-value">{parseThousands(form.providerFee, true)}%</p>
				</Col>
				<Col grow>
					<Input type="number" sufix="%" label="Comisión Cliente" name="fee" {...inputProps} value={form.fee} />
				</Col>
				<Col grow>
					<label className="input__label">Ganancia Financiera</label>
					<p className="input__label-value">{parseThousands(form.fee - form.providerFee, true)}%</p>
				</Col>
			</Row>
		</Card_Inputs>
	)
}
