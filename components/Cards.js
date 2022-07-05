import { IconButton } from '@/components/base/Buttons'
import Icon from '@/components/base/Icons'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import Col, { Row } from './base/Grid'
import Link from 'next/link'
import router from 'next/router'
import { parseMoney } from '@/adapters/Parsers'
import classNames from 'classnames'
import React from 'react'
import { getInputErrors } from './base/Inputs'
import { Divider } from '@material-ui/core'

export function Card_Persona({ data, onDelete, isCliente = false, isProveedor = false }) {
	let options = [
		{
			label: 'Registrar Depósito',
			icon: 'moneyexchange',
			link: '/transacciones/nuevo/deposito?clienteId=' + data.id,
		},
		{
			label: 'Ver Balance',
			icon: 'invoice',
			link: '/movimientos?clienteId=' + data.id,
		},
		{
			label: 'Editar Comisiones',
			icon: 'editfile',
			link: '/clientes/' + data.id + '/cuentas',
		},
		{
			label: 'Editar Cliente',
			icon: 'edit',
			link: '/clientes/' + data.id + '/editar',
		},
		{
			label: 'Eliminar',
			icon: 'delete',
			handler: () => onDelete(data.id)
		}
	];

	if (isProveedor) {
		options = [
			{
				label: 'Nuevo Pago',
				icon: 'moneyexchange',
				link: '/transacciones/nuevo/pagoProveedor?proveedorId=' + data.id,
			},
			{
				label: 'Ver Balance',
				icon: 'invoice',
				link: '/movimientos?proveedorId=' + data.id,
			},
			{
				label: 'Editar Cuentas',
				icon: 'editfile',
				link: '/proveedores/' + data.id + '/cuentas',
			},
			{
				label: 'Editar Proveedor',
				icon: 'edit',
				link: '/proveedores/' + data.id + '/editar',
			},
			{
				label: 'Eliminar',
				icon: 'delete',
				handler: () => onDelete(data.id)
			}
		]
	}
	return (
		<div className="card p-3 relative">

			{/* NAME */}
			<CardName pretitle={'ID: ' + data.id} title={data.name} glyph="user" />

			{/* DATA ITEMS */}
			<div className="md:pl-11">
				<CardData saldo={data.balance} email={data.email} tel={data.phone} />
			</div>

			{/* OPTIONS */}
			{/* <CardMenu options={options} /> */}
		</div>
	)
}

export function Card_Proveedor() {
	return (
		<div className="card p-3 relative">

			{/* NAME */}
			<CardName pretitle="ID: 123" title="Banco Ejemplar" glyph="bank" />

			{/* DATA ITEMS */}
			<CardData />

			{/* OPTIONS */}
			<CardMenu options={[
				{
					label: 'Editar Cuentas',
					icon: 'editfile'
				},
				{
					label: 'Editar Proveedor',
					icon: 'edit'
				},
				{
					label: 'Ver Detalle',
					icon: 'info'
				},
				{
					label: 'Eliminar',
					icon: 'editfile'
				}
			]} />
		</div>
	)
}

export function Card_Saldo({ title, body, sm = false }) {
	return (
		<div className={classNames("card p-4 relative ", { "py-5": !sm })}>
			<div className="dataSet my-0">
				<h6>{title}</h6>
				<h2 className={parseFloat(body) < 0 && 'text-red' }>{parseMoney(body)}</h2>
			</div>
		</div>
	)
}

export function Card_Persona_Small({ title, pretitle, postitle, glyph, errors = [], errorsName = '', ...props }) {
	let myErrors = getInputErrors(errors, errorsName)
	return (<div>
		<div className={classNames("card --flat p-3", { '--withError': myErrors.hasError })}>
			<CardName title={title} pretitle={pretitle} postitle={postitle} glyph={glyph} {...props} />
		</div>
		{myErrors.errorLables}
	</div>)
}

export function Card_Inputs({ divider = true, children, errors = [], errorsName = '', ...props }) {
	let myErrors = getInputErrors(errors, errorsName)
	return (<div>
		<div className="card --flat p-3">
			<CardName {...props} />
			{divider && <div className="pl-20">
				<hr className="my-3" />
			</div>}
			<div className="pl-20">
				{children}
			</div>
		</div>
		{myErrors.errorLables}
	</div>
	)
}


// CARD PARTS

export function CardName({ title, pretitle, postitle, glyph = 'user', sm = false }) {
	return (
		<div className={classNames("flex items-center flex-nowrap overflow-hidden", !sm ? "gap-3" : "gap-2")}>
			<div className={classNames("flex justify-center items-center rounded-full bg-gray-200 ", { "w-16 h-16": !sm }, { "w-7 h-7": sm })}>
				<Icon glyph={glyph} className={classNames("text-gray-400", !sm ? "text-icon-lg" : "text-icon")} />
			</div>
			<div className={classNames("dataSet flex-1 my-0 col-ellipsis overflow-hidden", { "flex align-center flex-col": sm })}>
				{pretitle && <h6>{pretitle}</h6>}
				<h3 className={classNames("text-ellipsis w-full overflow-hidden", { "text-h6 leading-none": sm })}>{title}</h3>
				{postitle && <p className={classNames({ "text-sm": sm })}>{postitle}</p>}
			</div>
		</div>
	)
}

function CardData({ saldo, email, tel }) {
	return (
		<Row cols={11}>
			<Col grow>
				<div className="dataSet">
					<p className="dataSet__title">Saldo</p>
					<p className={saldo < 0 && 'text-red'}>{parseMoney(saldo)}</p>
				</div>
			</Col>
			<Col span={4}>
				<div className="dataSet">
					<p className="dataSet__title">Email</p>
					<p>{email}</p>
				</div>
			</Col>
			<Col span={4}>
				<div className="dataSet">
					<p className="dataSet__title">Teléfono</p>
					<p>{tel}</p>
				</div>
			</Col>
		</Row>
	)
}

export function CardMenu({ options = [], children, buttonElement = null }) {
	const [anchorDD, setAnchorDD] = useState(null);
	const open = Boolean(anchorDD);
	const handleDDClick = (event) => {
		setAnchorDD(event.currentTarget);
	};
	const handleDDClose = () => {
		setAnchorDD(null);
	};

	let actualButton;
	if (buttonElement && React.isValidElement(buttonElement)) {
		let newProps = {};
		newProps.onClick = handleDDClick;
		actualButton = React.cloneElement(buttonElement, { ...newProps });
	}

	const myMenu = <Menu
		id="card-menu"
		anchorEl={anchorDD}
		open={open}
		onClose={handleDDClose}
		MenuListProps={{
			'aria-labelledby': 'card-menu-button',
		}}
	>
		{options.map((opt, i) => {
			if (opt.isDivider) {
				return <Divider key={i} />
			} else {
				return <MenuItem
					key={opt.label}
					onClick={() => {
						opt.handler && opt.handler(opt.handlerData);
						handleDDClose();
					}}
					{...opt}
				>
					{opt.link ?
						<Link href={opt.link}>
							<a>
								<Icon glyph={opt.icon} />
								<span>{opt.label}</span>
							</a>
						</Link>
						:
						<>
							<Icon glyph={opt.icon} />
							<span>{opt.label}</span>
						</>
					}
				</MenuItem>
			}
		})}
	</Menu>


	if (actualButton) {
		return <>
			{actualButton}
			{options && myMenu}
		</>
	} else {
		return (
			<div className="absolute top-1 right-1">
				{actualButton || <IconButton onClick={handleDDClick} id="card-menu-button" variant="light" isElevated={false} glyph="menu" />}
				{myMenu}
			</div>
		)
	}

}

const MyMenuItem = ({ link, className, children, onClick, ...props }) => {
	return <Link href={link}><a className={className} onClick={onClick} {...props} >{children}</a></Link>
}
