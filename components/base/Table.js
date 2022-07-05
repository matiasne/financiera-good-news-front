import Icon from '@/components/base/Icons'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
// import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap'
// import SlideToggle from "react-slide-toggle"
import Link from 'next/link'
import Button, { IconButton } from './Buttons';
import { parseMoney, parseThousands } from '@/adapters/Parsers';
import Input from '@/components/base/Inputs'
import { CardMenu } from '../Cards';
import { useRouter } from 'next/router';

export default function Table({
	content = {},
	tableHead,
	tableBody,
	tableData,
	queryData = {},
	lined = false,
	striped = true,

	isSortable = true,
	onSort = () => null,

	isSelectable = false,
	onSelect = () => null,
	disableSelect = (item) => false,
	selectedItem = null,

	tableActions,
	isTableActionsCompressed = true,
	trLink,
}) {

	const [myQueryData, setQueryData] = useState(queryData || {});
	const [selectedData, setSelectedData] = useState();
	const [selectedId, setSelectedId] = useState();
	const id = Date.now();
	const router = useRouter();
	// const [toggleEvent, setToggleEvent] = useState([0]);
	// const [exapnds, setExpands] = useState([]);

	// function onToggle(i) {
	// 	setExpands({ ...exapnds, [i]: exapnds[i] === true ? false : true });
	// 	setToggleEvent({ ...toggleEvent, [i]: Date.now() });
	// }

	let data = {
		tableHead: tableHead || content.tableHead || [],
		tableBody: tableBody || content.tableBody || [],
		tableActions: tableActions,
		trLink: trLink
	};

	if (tableData) {
		data.tableBody = [];
		tableData.map((dataObject, i) => {
			let newTd = [];
			data.tableHead.map((th, thIndex) => {
				newTd.push(th.getContent(dataObject));
			})
			data.tableBody.push(newTd);
		})
	}

	const iconClasses = 'text-icon-sm mr-2 text-shadow-300';

	const typeClasses = {
		text: '',
		id: 'font-bold',
		date: 'text-right',
		money: 'text-right',
		check: '',
		pill: 'text-center',
		percent: 'text-center',
		number: 'text-right',
		bubble: '',
		input: 'py-0 my-n1 w-0',
		actions: 'w-8 py-0',
		bigActions: 'py-0 text-center',
		thousands: 'text-right',
		html: '',
	};

	function handleSort(id) {
		let newQueryData = myQueryData;
		newQueryData.sort = id;
		if (id === queryData.sort) {
			newQueryData.order = newQueryData.order === 'asc' ? 'desc' : 'asc';
		} else {
			newQueryData.order = 'asc';
		}
		onSort(newQueryData);
		setQueryData(newQueryData);
		console.log(newQueryData);
	}

	function renderComplexTd(td, tdType = 'text', th = null) {
		let tdClasses = '';
		let tdContent = [];
		const originalTd = td;

		th && th.icon && tdContent.push(<Icon glyph={th.icon} className={classNames(iconClasses, th.iconClasses)} />);

		if (!td) {
			td = '-'
		}

		switch (tdType) {
			case 'percent':
				td = td + ' %';
				break;
			case 'money':
				td = parseMoney(originalTd);
				if (parseFloat(originalTd) < 0) tdClasses += ' text-red'
				break;
			case 'thousands':
				td = parseThousands(originalTd);
				break;
			case 'html':
				td = originalTd;
				break;
		}

		if (typeof td != 'object' || tdType === 'html') {
			tdContent.push(<span className={"td__label" + tdClasses}>{td}</span>)
		} else {
			switch (tdType) {
				case 'pill':
					tdContent.push(<small className={classNames('pill', td.pillClass)}>{td.label}</small>);
					break;

				case 'bubble':
					tdContent.push(<small className={classNames('bubble', 'mr-2', td.bubbleClass)}>-</small>);
					tdContent.push(<span className="td__label">{td.label}</span>);
					break;

				default:
					tdContent.push(<span className="td__label">{td.label}</span>);
					break;
			}

			if (td.hidden) return null
		}

		if (tdContent.length > 1) {
			return <span>{tdContent}</span>

		}

		return tdContent;
	}

	function renderDropdown(trigger, options, docsHandler = null) {
		// return (
		// 	<Dropdown drop={'up'} >
		// 		<Dropdown.Toggle as={'span'} id={"dropdown-tr"} >
		// 			{trigger}
		// 		</Dropdown.Toggle>
		// 		<div className="dropdown__effect">
		// 			<Dropdown.Menu >
		// 				{
		// 					options.title &&
		// 					<h6 className="px-3 pb-1 border-b center-v">
		// 						{options.icon && <Icon glyph={options.icon} className={iconClasses} />}
		// 						{options.title}
		// 					</h6>
		// 				}
		// 				<h6 className="text-base font-bold text-left px-3">Acciones</h6>
		// 				{
		// 					options.links.map((opt, i) => {
		// 						return <Dropdown.Item key={i} >

		// 							{opt.href ?
		// 								<Link href={opt.href}>
		// 									<span onClick={() => opt.handler === 'docs' && docsHandler && docsHandler()}>
		// 										<Icon glyph={opt.icon || 'link'} className={iconClasses} />
		// 										{opt.label}
		// 									</span>
		// 								</Link>
		// 								:
		// 								<span onClick={() => opt.handler === 'docs' && docsHandler && docsHandler()}>
		// 									<Icon glyph={opt.icon || 'link'} className={iconClasses} />
		// 									{opt.label}
		// 								</span>
		// 							}
		// 						</Dropdown.Item>
		// 					})
		// 				}
		// 			</Dropdown.Menu>
		// 		</div>
		// 	</Dropdown>
		// )
	}

	function handleSelect(trId, indexTr) {
		setSelectedId(trId);
		onSelect(tableData ? tableData[indexTr] : data.tableBody[indexTr]);
	}

	let trOrder = 'even';
	let totalCols = data.tableHead?.length;
	isSelectable && totalCols++;
	data.tableActions && totalCols++;

	let ThGroupIndex = 0;
	data.tableHead.map((th, indexTh) => {
		if (data.tableHead[indexTh].grouped) ThGroupIndex = indexTh;
	});

	return (
		<table className={classNames("table", { 'striped': striped }, { 'lined': lined }, { '--sortable': isSortable }, { '--selectable': isSelectable }, { '--clickable': trLink })}>
			<thead>
				<tr>
					{isSelectable && <th></th>}
					{
						data.tableHead.map((th, indexTh) => {
							let labelIsLeft = typeClasses[th.type].indexOf('text-right') > -1 ? false : true;
							let isActuallySortable = isSortable;
							if (th.isSortable === false) isActuallySortable = false;

							return <th key={indexTh} className={classNames(typeClasses[th.type], th.className)} 						>
								{isActuallySortable ?
									<span className='inline-block'>
										<Button size="sm" type="link" className="mx-n1 px-2 uppercase group" onClick={() => handleSort(th.id)}>
											{labelIsLeft && th.label}
											<Icon className="text-main" glyph={myQueryData.order === 'asc' || myQueryData.sort !== th.id ? 'chevron-up' : 'chevron-down'} className={isSortable && queryData.sort !== th.id && 'opacity-0 group-hover:opacity-100'} />
											{!labelIsLeft && th.label}
										</Button>
									</span>
									:
									th.label
								}
							</th>
						})
					}
					{data.tableActions && <th className={isTableActionsCompressed && typeClasses['actions']}></th>}
				</tr>
			</thead>

			<tbody>
				{
					data.tableBody.length >= 1 ?
						data.tableBody.map((tr, indexTr) => {
							let actualTr = [];
							let trClasses = '';
							if (typeof tr == 'object' && tr.length > 0) {
								actualTr = tr;
								if (indexTr === 0) {
									trOrder = 'odd';
								} else {
									if (ThGroupIndex) {
										if (actualTr[ThGroupIndex] != data.tableBody[indexTr - 1][ThGroupIndex]) {
											trOrder = trOrder === 'even' ? 'odd' : 'even';
										}
									} else {
										trOrder = trOrder === 'even' ? 'odd' : 'even';
									}
								}

							} else {
								actualTr = tr.data;

								// CHECHEA PARA AGRUPAR TR
								let prevTr = data.tableBody[indexTr - 1];
								if (indexTr === 0 || tr.group != prevTr.group || !tr.group) {
									trOrder = trOrder === 'even' ? 'odd' : 'even';
								} else {
									actualTr[0] = { hidden: true };
								}
							}

							// COMPARA SI TIENE SELECTION
							let isTrSelected = false;
							if (selectedItem && isSelectable) {
								if (data.tableHead[0].getContent(tableData[indexTr]) === data.tableHead[0].getContent(selectedItem)) {
									isTrSelected = true;
								}
							}

							const trId = 'tr-' + indexTr;
							trClasses = classNames(trClasses, trOrder, { '--selected': isTrSelected });

							const trActions = data.tableActions ? data.tableActions.map((action, i) => {
								if (action.isDivider) {
									return {
										...action
									}
								} else {
									return {
										link: action.makeLink ? action.makeLink(tableData[indexTr]) : action.link,
										actionLink: () => {
											if (action.makeLink || action.link) {
												return router.push(action.makeLink ? action.makeLink(tableData[indexTr]) : action.link)
											}
											if (action.onClick) {
												return action.onClick(tableData[indexTr])
											}
										},
										handlerData: tableData[indexTr],
										...action
									}
								}
							}) : [];

							return <>
								<tr key={trId} className={trClasses} onClick={() => trLink ? router.push(trLink(tableData[indexTr])) : null}>
									{isSelectable &&
										<td className={classNames('input', typeClasses['input'])}>
											{!disableSelect(tableData[indexTr]) &&
												<Input type="radio" name={id} id={id + '-tr-' + indexTr} onChange={(e) => handleSelect(trId, indexTr)} checked={isTrSelected && 'checked'} />
											}
										</td>
									}
									{actualTr && actualTr.map((td, indexTd) => {
										const tdType = data.tableHead[indexTd].type;
										const tdKey = 'td-' + indexTd + '-' + Date.now();
										return (
											<td key={tdKey} className={classNames(typeClasses[tdType], td && typeof td == 'object' && td.className, data.tableHead[indexTd].className)}>
												{renderComplexTd(td, tdType, data.tableHead[indexTd])}
											</td>
										)
									})
									}
									{data.tableActions && isTableActionsCompressed &&
										<td className={typeClasses['actions']}>
											<CardMenu
												buttonElement={<IconButton type="link" variant='neutral' size='md' glyph="menu" />}
												options={trActions}
											/>
										</td>
									}
									{data.tableActions && !isTableActionsCompressed &&
										<td className={typeClasses['bigActions']}>
											<div className='flex justify-end gap-1'>
												{trActions.map((action, i) => {
													return <Button type='link' size="sm" onClick={action.actionLink}>{action.label}</Button>
												})}
											</div>
										</td>
									}
								</tr>

								{
									data.tableActions && data.tableActions.expand &&
									<tr className="collapsibleData__tr" key={indexTr}>
										<td className="collapsibleData__td" colSpan={data.tableHead.length + 1}>
											{/* <SlideToggle toggleEvent={toggleEvent[indexTr] || 0} collapsed >
												{({ setCollapsibleElement }) => (
													<div className="collapsibleData">
														<div
															className="collapsibleData__content w-full"
															ref={setCollapsibleElement}
														>
															<div className="collapsibleData__content-inner">
																{data.tableActions.expand}
															</div>
														</div>
													</div>
												)}
											</SlideToggle> */}
										</td>
									</tr>
								}
							</>

						})
						:
						<tr key="empty">
							<td className="text-center py-8 text-base italic" colSpan={totalCols} >Sin datos para mostrar...</td>
						</tr>
				}
			</tbody>
		</table>
	)
}
