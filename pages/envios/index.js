import { parseDatetime, parseMoney } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData, QueryAutocomplete } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import Col, { Container, Row, Rows } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import NoResults from '@/components/base/NoResults'
import Spinner from '@/components/base/Spinner'
import Table from '@/components/base/Table'
import MainLayout from '@/components/layout/MainLayout'
import axios from 'axios'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { PillSwitcher } from 'react-pill-switcher'
import { useMutation } from 'react-query'
import { CSSTransition, SwitchTransition } from "react-transition-group"


const Page = ({ session }) => {
	const [pillValue, setPillValue] = useState('Envíos');
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearchLoading, setSearchLoading] = useState(false);

	const [sort, setSort] = useState('createdAt');
	const [order, setOrder] = useState('desc');
	const [deleteId, setDeleteId] = useState(0);

	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({});

	const mutationDelete = useMutation(formData => {
		return axios(getQueryFullData('providerDelete', deleteId, session))
	}, {
		onSuccess: (data) => {
			toast('Proveedor eliminado exitosamente');
		},
		onError: (err) => {
			toast.error('Ocurrió un error');
		},
		onSettled: (data) => {
			setDeleteId(0);
		}
	})

	const tableHead = [
		{
			id: 'id',
			label: 'ID',
			type: 'id',
			getContent: (e) => e.id,
		},
		{
			id: 'createdAt',
			label: 'Fecha',
			type: 'id',
			getContent: (e) => parseDatetime(e.createdAt),
		},
		{
			id: 'customerName',
			label: 'Cliente',
			type: 'text',
			getContent: (e) => e.customerName,
		},
		{
			id: 'providerName',
			label: 'Destinatario',
			type: 'text',
			getContent: (e) => e.receiverName + ' (' + e.receiverDocument + ')',
		},
		{
			id: 'total',
			label: 'Monto',
			type: 'money',
			getContent: (e) => e.total,
		},

	];

	return (
		<>
			<article className="contentSet">

				<div className="contentSet__shrink">
					{/* FILTERS */}
					<div className="flex gap-3 justify-between">
						{/* <PillSwitcher name="filters" options={['Todos', 'Envíos', 'Depósitos', 'Retiros', 'Devoluciones']} onChange={(e) => { setPillValue(e); setPage(1); setSort('createdAt'); setOrder('asc'); }} /> */}
						<div></div>
						<div className="">
							<Button type='light' variant='outline' isFilled iconStart="filters" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</Button>
						</div>
					</div>
				</div>

				{/* ALL FILTERS */}
				<div className={classNames("contentSet__shrink", { 'hidden': !showFilters })}>
					<AdvancedFilters session={session} onFilter={setFilters} />
				</div>

				<div className="contentSet__scrollable">
					<Container>

						<QueryContent
							id={"envioSearch"}
							queryData={{
								size: 20,
								sort: sort,
								order: order,
								...filters
							}}
							hasPagination
							session={session}
							content={(data, queryData) => {
								let items = data.data;
								return (
									<Table striped={false} lined={true}
										tableData={items}
										queryData={queryData}
										onSort={(e) => {
											setOrder(e.order);
											setSort(e.sort);
										}}
										tableHead={tableHead}
									/>
								)
							}}
						/>

					</Container>
				</div>

			</article>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Envíos',
	actionLink: '/envios/nuevo',
}
export default Page

// PAGE FILTERS
function AdvancedFilters({ session, onFilter = () => null }) {
	const [client, setClient] = useState(null);
	const [provider, setProvider] = useState(null);
	const formik = useFormik({
		initialValues: {
			from: null,
			to: null,
			// montoDesde: '',
			// montoHasta: '',
			customerId: '',
			providerId: '',
		},
		onSubmit: (values) => {
			onFilter(values);
		},
	})

	function handleReset(e) {
		formik.resetForm(e);
		formik.submitForm(e);
		setClient(null);
		setProvider(null);
	}

	return (
		<div className="card --flat p-3">
			<Rows gap={5}>
				<Row>
					<Col grow>
						<h6 className='text-h6 font-bold text-gray-600'>Filtrar:</h6>
					</Col>
					<Col auto>
						<div className="flex gap-2">
							<Button type='success' isElevated={false} size='sm' onClick={formik.submitForm}>Filtrar</Button>
							<Button type='neutral' isElevated={false} size='sm' onClick={handleReset}>Limpiar Filtros</Button>
						</div>
					</Col>
				</Row>
				<Row cols={3}>
					<Col>
						<label htmlFor="from" className='input__label'>Fecha</label>
						<Row cols={2} gap={1}>
							<Col grow>
								<Input type="date" name="from" value={formik.values.from} onChange={(e) => formik.setFieldValue('from', e.value)} />
							</Col>
							<Col auto><p className='pt-1'>a</p></Col>
							<Col grow>
								<Input type="date" name="to" value={formik.values.to} onChange={(e) => formik.setFieldValue('to', e.value)} />
							</Col>
						</Row>
					</Col>
					<Col>
						<QueryAutocomplete label="Cliente" id="clientSearch" session={session}
							queryData={{
								sort: 'name',
								order: 'asc',
							}}
							value={client}
							getOptionLabel={(option) => option.name}
							onSelect={(selection) => {
								setClient(selection);
								formik.setFieldValue('customerId', selection?.id || null);
							}}
						/>
					</Col>
					{/* <Col>
						<QueryAutocomplete label="Proveedor" id="providerSearch" session={session}
							queryData={{
								sort: 'name',
								order: 'asc',
							}}
							value={provider}
							getOptionLabel={(option) => option.name}
							onSelect={(selection) => {
								selection && setProvider(selection);
								selection && formik.setFieldValue('providerId', selection.id);
							}}
						/>
					</Col> */}
				</Row>
			</Rows>
		</div>
	)
}
