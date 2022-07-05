import { signin, signout, useSession } from 'next-auth/client'
import Icon from '@/components/base/Icons';
import Link from 'next/link';
import React from 'react';
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Button, { ButtonGroup, IconButton } from '../base/Buttons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react'
import { CardMenu } from '../Cards';


export default function Header({ title, actionLink, actionMenu, role, session }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	let newActionMenu = actionMenu;

	switch (role) {
		case 'EDITOR':
			if (actionMenu) {
				newActionMenu = actionMenu.filter((item, i) => !item.lockEditor);
			}
			break;

		default:
			break;
	}

	return (
		<header>
			<SwitchTransition>
				<CSSTransition
					key={title}
					addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
					classNames='fade'
				>
					<div className="flex items-center h-full gap-3">
						<h1>{title}</h1>
						{actionLink &&
							<Link href={actionLink}>
								<Button type="success" size="md" iconEnd="plus">Nuevo</Button>
							</Link>
						}
						{newActionMenu &&
							<CardMenu
								buttonElement={<Button type="success" iconEnd="chevron-down">Nuevo</Button>}
								options={newActionMenu}
							/>
						}
						{/* {actionMenu &&
							<ButtonGroup type="success" dividers>
								<Button isLabel>Nuevo</Button>
								<CardMenu
									buttonElement={<Button type="success" className="h-full"><Icon glyph="chevron-down" /></Button>}
									options={actionMenu}
								/>
							</ButtonGroup>
						} */}
					</div>
				</CSSTransition>
			</SwitchTransition>


			{role !== 'VISITOR' &&
				<div className='flex flex-row items-center gap-3'>
					{session && <p className='font-bold text-base'>{session.username}</p>}
					<IconButton glyph="user" id="user-menu-button" onClick={handleClick} type="neutral" isElevated={false} />
					<Menu
						id="user-menu"
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'user-menu-button',
						}}
					>
						<MenuItem onClick={() => signout()}><Icon glyph="logout" /> <span>Cerrar Sesión</span></MenuItem>
					</Menu>
				</div>
			}
		</header >
	)
}
