import React, { useState } from 'react'
import classNames from 'classnames'

import Heart from '@/icons/heart.svg'
import Share from '@/icons/share.svg'
import Search from '@/icons/search.svg'
import Chevron from '@/icons/chevron.svg'
import Instagram from '@/icons/instagram.svg'
import Facebook from '@/icons/facebook.svg'
import WhatsApp from '@/icons/whatsapp.svg'
import Close from '@/icons/close.svg'
import Burger from '@/icons/bars.svg'
import Home from '@/icons/home.svg'
import Moneybag from '@/icons/moneybag.svg'
import MoneyExchange from '@/icons/money-withdraw.svg'
import Exchange from '@/icons/exchange.svg'
import User from '@/icons/user.svg'
import Users from '@/icons/users.svg'
import Arrow from '@/icons/arrow.svg'
import Bank from '@/icons/bank.svg'
import Delete from '@/icons/trash.svg'
import Menu from '@/icons/ellipsis-v.svg'
import Plus from '@/icons/plus.svg'
import Edit from '@/icons/edit.svg'
import Editfile from '@/icons/file-edit.svg'
import Info from '@/icons/info.svg'
import Logout from '@/icons/logout.svg'
import Warning from '@/icons/warning.svg'
import Success from '@/icons/success.svg'
import Filters from '@/icons/filters.svg'
import Calendar from '@/icons/calendar.svg'
import File from '@/icons/file.svg'
import Invoice from '@/icons/invoice.svg'
import MoneyStack from '@/icons/money-stack.svg'
import FileExport from '@/icons/file-export.svg'
import Emails from '@/icons/emails.svg'


export default function Icon({ glyph = 'empty', style, className, ...props }) {
	const components = {
		'': <></>,
		'heart': <Heart />,
		'share': <Share />,
		'search': <Search />,
		'chevron': <Chevron />,

		'instagram': <Instagram />,
		'facebook': <Facebook />,
		'whatsapp': <WhatsApp />,

		'close': <Close />,
		'burger': <Burger />,
		'home': <Home />,
		'moneybag': <Moneybag />,
		'moneyexchange': <MoneyExchange />,
		'exchange': <Exchange />,
		'user': <User />,
		'users': <Users />,
		'bank': <Bank />,
		'delete': <Delete />,
		'menu': <Menu />,
		'plus': <Plus />,
		'arrow': <Arrow />,
		'edit': <Edit />,
		'editfile': <Editfile />,
		'info': <Info />,
		'logout': <Logout />,
		'warning': <Warning />,
		'success': <Success />,
		'filters': <Filters />,
		'calendar': <Calendar />,
		'file': <File />,
		'invoice': <Invoice />,
		'moneystack': <MoneyStack />,
		'fileexport': <FileExport />,
		'emails': <Emails/>,
	}

	let mySvg = [];
	let newStyle = style || {};
	let g = glyph.toLowerCase();

	let transformations = g.split('-');
	mySvg = components[transformations[0]];

	transformations.map(t => {
		switch (t) {
			case 'prev': case 'left':
				newStyle.transform = 'rotate(180deg)';
				break;
			case 'up':
				newStyle.transform = 'rotate(-90deg)';
				break;
			case 'down':
				newStyle.transform = 'rotate(90deg)';
				break;
			case 'next': case 'right': default:
				// newStyle.transform = '';
				break;
		}
	})


	return (
		<i className={classNames('ic', 'ic-' + g, className)} style={newStyle}>
			{mySvg}
		</i>
	);
}
