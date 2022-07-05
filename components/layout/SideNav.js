import React, { useEffect, useState } from 'react';
// import $ from 'jquery';
// import { NavLink } from 'react-router-dom';
// import allActions from '../helpers/main';

// import Icon from '../shared/Icon';
import Icon from '@/components/base/Icons'
import NavLink from '@/components/base/NavLink'
import { IconButton } from '../base/Buttons';
import classNames from 'classnames';

export default function SideNav({ role = 'ADMIN', menuIsCollapsed, setMenuCollapsed }) {
	const [isCollapsed, setCollapsed] = useState(menuIsCollapsed);

	function menuCollapse() {
		setCollapsed(!isCollapsed);
		setMenuCollapsed(!isCollapsed);
	};

	let links = {
		empty: <NavItem isActive key="empty" id="empty" label="Inicio" link="#" icon="home" />,
		dashboard: <NavItem exact key="dashboard" id="dashboard" label="Dashboard" link="/" icon="home" />,
		clientes: <NavItem key="clientes" id="clientes" label="Clientes" link="/clientes" icon="user" />,
		proveedores: <NavItem key="proveedores" id="proveedores" label="Proveedores" link="/proveedores" icon="bank" />,
		movimientos: <NavItem key="movimientos" id="movimientos" label="Movimientos" link="/movimientos" icon="invoice" />,
		transacciones: <NavItem key="transacciones" id="transacciones" label="Transacciones" link="/transacciones" icon="moneyexchange" />,
		envios: <NavItem key="envios" id="envios" label="Envíos" link="/envios" icon="exchange" />,
		usuarios: <NavItem key="usuarios" id="usuarios" label="Usuarios" link="/usuarios" icon="users" />,
	}

	let permitted = [];

	switch (role) {
		case 'ADMIN':
			permitted.push(links.dashboard);
			permitted.push(links.clientes);
			permitted.push(links.proveedores);
			permitted.push(links.movimientos);
			permitted.push(links.transacciones);
			permitted.push(links.envios);
			permitted.push(links.usuarios);
			break;

		case 'EDITOR':
			permitted.push(links.transacciones);
			break;

		case 'VISITOR':
			permitted.push(links.empty);
			break;


		default:
			break;
	}

	return (
		<nav className={classNames({ '--collapsed': isCollapsed })}>
			<ul>
				{permitted}
			</ul>
			<div className="px-2">
				<IconButton type="dark" className="shadow-none bg-gray-900 hover:bg-gray-700" onClick={menuCollapse} glyph={isCollapsed ? 'chevron-next' : 'chevron-prev'} />
			</div>
		</nav>
	);

}

function NavItem({ id, label, icon, link, isActive, ...props }) {
	return (
		<li key={id}>
			<NavLink href={link} className='clearfix' activeLink={!props.exact && link} isActive={isActive} activeClassName='--active'>
				<a>
					<Icon glyph={icon} />
					<span>{label}</span>
				</a>
			</NavLink>
		</li>
	)
}
