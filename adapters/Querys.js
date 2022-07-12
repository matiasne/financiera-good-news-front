import Icon from '@/components/base/Icons'
import Spinner from '@/components/base/Spinner'
import Input from '@/components/base/Inputs'
import axios from 'axios'
import classNames from 'classnames'
import { getSession, useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { useInfiniteQuery, useMutation, useQuery } from 'react-query'
import Button from '@/components/base/Buttons'

const myQueries = {
	test: {
		url: 'https://li1113-99.members.linode.com:8443/buclera-api-0.0.1-SNAPSHOT/categories/search',
		method: 'post',
		public: true,
	},
	balances: {
		url: process.env.DB_URL + '/balances',
		method: 'get',
		public: false,
	},
	// CLIENTS / CUSTOMERS
	clientSearch: {
		url: process.env.DB_URL + '/customers/search',
		method: 'post',
		public: false,
	},
	clientCreate: {
		url: process.env.DB_URL + '/customers',
		method: 'post',
		public: false,
	},
	clientUpdate: {
		makeUrl: (data) => process.env.DB_URL + '/customers/' + data.id,
		method: 'put',
		public: false,
	},
	clientDelete: {
		url: '',
		makeUrl: (data) => process.env.DB_URL + '/customers/' + data,
		method: 'delete',
		public: false,
	},
	clientGet: {
		url: '',
		makeUrl: (data) => process.env.DB_URL + '/customers/' + data,
		method: 'get',
		public: false,
	},
	clientcommissionGet: {
		url: '',
		makeUrl: (data) => process.env.DB_URL + '/customers/commissions/' + data,
		method: 'get',
		public: false,
	},
	clientcommissionUpdate: {
		url: '',
		makeUrl: (data) => process.env.DB_URL + '/customers/commissions',
		method: 'put',
		public: false,
	},
	// PROVEEDORES
	providerSearch: {
		url: process.env.DB_URL + '/providers/search',
		method: 'post',
		public: false,
	},
	providerCreate: {
		url: process.env.DB_URL + '/providers',
		method: 'post',
		public: false,
	},
	providerUpdate: {
		makeUrl: (data) => process.env.DB_URL + '/providers/' + data.id,
		method: 'put',
		public: false,
	},
	providerDelete: {
		url: '',
		makeUrl: (data) => process.env.DB_URL + '/providers/' + data,
		method: 'delete',
		public: false,
	},
	providerGet: {
		url: '',
		makeUrl: (data) => process.env.DB_URL + '/providers/' + data,
		method: 'get',
		public: false,
	},
	providerAccountGet: {
		url: '',
		makeUrl: (data) => process.env.DB_URL + '/providers/accounts/' + data,
		method: 'get',
		public: false,
	},
	providerAccountsSearch: {
		url: process.env.DB_URL + '/providers/accounts/search',
		method: 'post',
		public: false,
	},
	providerAccountsUpdate: {
		url: process.env.DB_URL + '/providers/accounts',
		method: 'put',
		public: false,
	},
	// MOVIMIENTOS
	movimientoSearch: {
		url: process.env.DB_URL + '/movements/search',
		method: 'post',
		public: false,
	},
	transactionSearch: {
		url: process.env.DB_URL + '/transactions/search',
		method: 'post',
		public: false,
	},
	envioSearch: {
		url: process.env.DB_URL + '/payment_intentions/search',
		method: 'post',
		public: false,
	},
	envioCreate: {
		url: process.env.DB_URL + '/payment_intentions',
		method: 'post',
		public: false,
	},
	depositoSearch: {
		url: process.env.DB_URL + '/deposits/search',
		method: 'post',
		public: false,
	},
	depositoSearchTickets: {
		url: process.env.DB_URL + '/deposits/tickets/search',
		method: 'post',
		public: true,
	},
	depositoCreate: {
		url: process.env.DB_URL + '/deposits',
		method: 'post',
		public: false,
	},
	depositoUpdate: {
		makeUrl: (data) => process.env.DB_URL + '/deposits/' + data.id,
		method: 'put',
		public: false,
	},
	depositoGet: {
		makeUrl: (data) => process.env.DB_URL + '/deposits/' + data,
		method: 'get',
		public: false,
	},
	depositoInternalGet: {
		makeUrl: (data) => process.env.DB_URL + '/deposits/internalId/' + data,
		method: 'get',
		public: false,
	},
	retiroSearch: {
		url: process.env.DB_URL + '/payments/search',
		method: 'post',
		public: false,
	},
	retiroCreate: {
		url: process.env.DB_URL + '/payments',
		method: 'post',
		public: false,
	},
	retiroGet: {
		makeUrl: (data) => process.env.DB_URL + '/payments/' + data,
		method: 'get',
		public: false,
	},
	pagoProveedorSearch: {
		url: process.env.DB_URL + '/providers/cash_delivery/search',
		method: 'post',
		public: false,
	},
	pagoProveedorCreate: {
		url: process.env.DB_URL + '/providers/cash_delivery',
		method: 'post',
		public: false,
	},
	pagoProveedorGet: {
		makeUrl: (data) => process.env.DB_URL + '/providers/cash_delivery/' + data,
		method: 'get',
		public: false,
	},
	sendMails: {
		url: process.env.DB_URL + '/mails',
		method: 'post',
		public: false,
	}
}

function getQueryData(id = '') {
	return id && myQueries[id] ? myQueries[id] : {}
}

export function getQueryFullData(id = '', queryData, session = null) {
	const fetchBase = getQueryData(id);
	return {
		url: fetchBase.makeUrl ? fetchBase.makeUrl(queryData) : fetchBase.url,
		method: fetchBase.method,
		data: fetchBase.method !== 'delete' && fetchBase.method !== 'get' && queryData,
		headers: {
			'Content-Type': "application/json; charset=utf-8",
			'corsOrigin': '*',
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
			"Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
			'Authorization': !fetchBase.public && session && session.accessToken,
		}
	}
}

export default function QueryContent({
	id,
	content = null,
	loadingContent = null,
	errorContent = null,
	queryData,
	session,
	onUpdated = () => null,
	loadWhenUpdating = false,
	hasPagination = false,
	emptyContent = null,
	...props
}) {

	const fetchBase = getQueryData(id);
	const [options, setOptions] = useState(getQueryFullData(id, queryData, session));
	const [queryId, setQueryId] = useState(queryData ? [id, queryData] : id);
	const [page, setPage] = useState(1);


	useEffect(() => {
		
		let newQueryId = queryData ? [id, queryData] : id;
		if (newQueryId !== queryId) {
			setOptions(getQueryFullData(id, queryData, session));
			setQueryId(newQueryId);
		}
	}, [queryData])

	useEffect(() => {
		if (hasPagination) {
			let newQueryData = queryData;
			newQueryData.page = page;
			setOptions(getQueryFullData(id, newQueryData, session));
		}
	}, [page])

	// INITIAL LOADING
	if (!session && !fetchBase.public) {
		console.log('Cargando Sesion')
		return loadingContent || renderLoading('Cargando Sesion')
	} else {
		const { isLoading,
			isError,
			error,
			data,
			isFetching,
			isPreviousData,
		} = useQuery(
			queryId,
			() => {
				
				return axios(options).then(res => {
					onUpdated();
					return res.data
				})
			},
			{
				keepPreviousData: true,
				enabled: queryData !== false,
				...props
			}
		)

		if (isLoading || (isFetching && loadWhenUpdating) || queryData === false) return loadingContent || renderLoading('Cargando...')

		// QUERY ERROR (SERVER)
		if (isError) return errorContent || renderError('Error de servidor: ' + error)

		// QUERY WORKED BUT RETURNED ERROR

		if (content && data && data.message) return renderError('Ocurrió un error: ' + data.message)
		if (content && data && data.error) return renderError('Ocurrió un error: ' + data.error)

		if (content) {
			let pages = hasPagination && data.total ? Math.ceil(data.total / queryData.size) : '-';

			if (data.total === 0 && emptyContent) return emptyContent
			return <div>
				{content(data, queryData)}
				{hasPagination && <div className="flex gap-2 mt-4">
					<div className="w-full">
						<p>Pág. {page} de {pages}</p>
					</div>
					<Button variant="light" isElevated={false} onClick={() => setPage(page - 1)} disabled={page === 1 || data.total <= 0}>Anterior</Button>
					<Button variant="light" isElevated={false} onClick={() => setPage(page + 1)} disabled={page === pages || data.total <= 0}>Siguiente</Button>
				</div>}
			</div>
		}

		return JSON.stringify(data)
	}
}

export function QueryInfiniteContent({ id, queryId = '', content = null, loadingContent = null, queryData, session, onUpdated = () => null, ...props }) {
	const fetchBase = getQueryData(id);
	const [options, setOptions] = useState(getQueryFullData(id, queryData, session));
	const [myQueryId, setQueryId] = useState(queryId || queryData ? [id, queryData] : id);

	useEffect(() => {
		setOptions(getQueryFullData(id, queryData, session));
	}, [queryData])

	useEffect(() => {
		setQueryId(queryId || queryData ? [queryId || id, queryData] : queryId || id);
	}, [queryId])



	// INITIAL LOADING
	if (!session && !fetchBase.public) {
		return loadingContent || renderLoading('Cargando Sesion')
	} else {
		const { isLoading,
			isError,
			error,
			data,
			isFetching,
			isPreviousData,
			fetchNextPage,
			hasNextPage,
			isFetchingNextPage,
			status,
		} = useInfiniteQuery(myQueryId, ({ pageParam = 1 }) => {
			let finalOptions = options;
			finalOptions.data.page = pageParam;
			return axios(finalOptions).then(res => {
				let data = res.data;
				data.queryData = finalOptions.data;
				return data;
			})
		},
			{
				keepPreviousData: true,
				getNextPageParam: (lastPage, pages) => {
					if (lastPage.total >= lastPage.queryData.size * lastPage.queryData.page) {
						return lastPage.queryData.page + 1
					} else {
						return undefined
					}
				},
				...props
			}
		)

		useEffect(() => {
			data && onUpdated(data);
		}, [data])

		if (isLoading) return loadingContent || renderLoading('Cargando...')

		// QUERY ERROR (SERVER)
		if (isError) return renderError('Error de servidor: ' + error)

		// QUERY WORKED BUT RETURNED ERROR

		if (content && data && data.message) return renderError('Ocurrió un error: ' + data.message)
		if (content && data && data.error) return renderError('Ocurrió un error: ' + data.error)

		if (content) {
			return content(data, fetchNextPage, isFetchingNextPage, hasNextPage)
		}

		return JSON.stringify(data)
	}
}

export function QueryAutocomplete({
	id,
	queryData,
	queryParam = 'name',
	on = null,
	session,
	onSelect = (e) => e,
	placeholder = "Escribe para buscar...",
	label = "",
	clearOnSelect = false,
	...props
}) {

	const [options, setOptions] = useState([]); // AUTOCOMPLETE LIST OF SELECTABLE OPTIONS
	const [queryOptions, setQueryOptions] = useState(getQueryFullData(id, queryData, session));
	const [searchValue, setSearchValue] = useState('');
	const [value, setValue] = useState(props.value || '');
	const [queryId, setQueryId] = useState(id);

	const mutation = useMutation(formData => {
		return axios(formData);
	}, {
		mutationKey: queryId,
		onSuccess: (data, variables, context) => {
			if (data.config.method === 'get') {
				setOptions(data.data);
			} else {
				setOptions(data.data.data);
			}
		},
		onError: (err) => {
			console.log(err);
		}
	})

	useEffect(() => {
		if (queryData !== false) {
			CallData();
		}
	}, [])

	useEffect(() => {
		setValue(props.value);
	}, [props.value])

	useEffect(() => {
		if (wait) {
			clearTimeout(wait);
			wait = 0;
		}
		wait = setTimeout(() => {
			if (queryData !== false) {
				CallData();
			}
		}, 350)
	}, [on, searchValue])

	async function CallData() {
		let newQueryData = queryData;
		if (typeof queryData === 'object' || !queryData) {
			newQueryData = queryData || {};
			newQueryData['page'] = 1;
			newQueryData['size'] = 100;
			newQueryData[queryParam] = searchValue;
		}
		setQueryId([id, newQueryData]);
		let newFormData = getQueryFullData(id, newQueryData, session);
		setQueryOptions(newFormData);

		if (newQueryData) mutation.mutate(newFormData);
	}

	let autocompleteProps = { ...props };
	autocompleteProps.loading = mutation.isLoading;
	autocompleteProps.onInputChange = (e) => { e && setSearchValue(e.target.value); }
	autocompleteProps.clearOnBlur = true;
	autocompleteProps.blurOnSelect = true;
	autocompleteProps.onBlur = () => setSearchValue();
	// autocompleteProps.onOpen = (e) => { setSearchValue(''); }

	return <Input type="autocomplete" label={label} name={id} id={id} placeholder={placeholder} value={value || ''}
		iconEnd="search"
		options={options}
		autocompleteProps={autocompleteProps}
		disabled={props.disabled}
		onChange={(selection) => {
			setSearchValue(); // prevents research after select
			setValue(selection);
			onSelect(selection);
		}}
	/>
}

// PRIVATE PARTS
function renderError(msg) {
	return <div className="w-full flex items-center gap-1 flex-col my-6">
		<Icon glyph="info" className="text-icon text-gray-400" />
		<p className="text-center text-base text-gray-500 m-0">{msg}</p>
	</div>
}

function renderLoading(msg) {
	return <div className="w-full flex items-center gap-1 flex-col my-6">
		<Spinner />
		{msg && <p className="text-center text-base text-gray-500 m-0">{msg}</p>}
	</div>
}

var wait = 0;
