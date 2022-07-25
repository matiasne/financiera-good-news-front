import { dataURLtoFile, parseDatetime, parseStatus } from '@/adapters/Parsers'
import QueryContent, { getQueryFullData } from '@/adapters/Querys'
import Button from '@/components/base/Buttons'
import { Container } from '@/components/base/Grid'
import Table from '@/components/base/Table'
import MainLayout from '@/components/layout/MainLayout'
import axios from 'axios'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'


function Page({ session }) {
	const router = useRouter();
	// const [isConfirming, setConfirming] = useState(false);
	const [sort, setSort] = useState('createdAt');
	const [order, setOrder] = useState('desc');
	const [filters, setFilters] = useState({});

	// customerId: 100
	// from: "2022-04-06T22:08:14.000Z"
	// order: "desc"
	// providerId: ""
	// size: 20
	// sort: "createdAt"
	// to: "2022-04-14T22:08:16.000Z"

	// https://goodnews-front.vercel.app/tickets?customerId=100&providerId=&from=2022-03-06T22:08:14.000Z&to=2022-03-12T22:08:14.000Z

	useEffect(() => {
		if (router.isReady) {
			setFilters({
				providerId: router.query?.providerId,
				customerId: router.query?.customerId,
				from: router.query?.from,
				to: router.query?.to
			})
		}
	}, [router])

	const searchParams = {
		singular: 'Depósito',
		id: 'depositoSearchTickets',
		tableHead: [
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
				label: 'Proveedor',
				type: 'text',
				getContent: (e) => e.providerName,
			},
			{
				id: 'providerAccountNumber',
				label: 'Cuenta',
				type: 'text',
				getContent: (e) => '#' + e.providerAccountNumber,
			},
			{
				id: 'cuit',
				label: 'CUIT',
				type: 'text',
				getContent: (e) => e.cuit,
			},
			{
				id: 'status',
				label: 'Estado',
				type: 'text',
				getContent: (e) => parseStatus(e.status),
			},
			{
				id: 'total',
				label: 'Monto',
				type: 'money',
				getContent: (e) => e.total,
			},
			{
				id: 'file',
				label: 'Comprobante',
				type: 'html',
				isSortable: false,
				getContent: (e) => {
					if (e.file && e.file.indexOf('data:') > -1) {
						return <div className="">
							{e.file.indexOf('data:image') > -1 ?
								<a download={'goodnews-comprobante-' + e.id + '.jpg'} href={e.file}>
									<Button size='sm' type='link' isElevated={false} iconStart={'file'}>Descargar</Button>
								</a>
								:
								<a download={'goodnews-comprobante-' + e.id + '.pdf'} href={e.file}>
									<Button size='sm' type='link' isElevated={false} iconStart={'file'}>Descargar</Button>
								</a>
							}
						</div>
					} else {
						return <span className='text-center text-sm italic'>Sin Comprobante</span>
					}
				},
			},

		],
		// tableActions: [
		// 	{
		// 		label: 'Descargar',
		// 		icon: 'download',
		// 		makeLink: (e) => '?viewId=' + e.id + '&viewType=' + parseDtype(e.dtype, true)
		// 	},
		// ],

	}

	const mutation = useMutation(formData => {
		return axios(getQueryFullData('sendMails', {}, session))
	}, {
		onError: (error, variables, context) => {
			setErrors(error.response.data);
			setConfirming(false);
			toast.error('Ocurrió un error al enviar emails');
		},
		onSuccess: (data, variables, context) => {
			toast.success('Emails enviados correctamente');
		},
		onSettled: () => {
			setConfirming(false);
		},
	})

	return (
		<>
			<article className="contentSet">
				<div className="contentSet__scrollable">
					<Container size="fluid" className="mb-5 mt-2">
						{
							router && router.isReady &&
							<QueryContent
								id={searchParams.id}
								queryData={{
									size: 100,
									sort: sort,
									order: order,
									...filters
								}}
								hasPagination
								session={session}
								// loadWhenUpdating
								content={(data, queryData) => {
									let items = data.data;
									let zip = new JSZip();
									items.map((item, i) => item.file && zip.file(
										'goodnews-comprobante-' + item.id + (item.file.indexOf('data:image') > -1 ? '.jpg' : '.pdf'),
										dataURLtoFile(item.file, 'goodnews-comprobante-' + item.id + (item.file.indexOf('data:image') > -1 ? '.jpg' : '.pdf'))
									));

									let downloadZip = () => zip.generateAsync({ type: "blob" }).then(function (content) {
										saveAs(content, "goodnews-comprobantes.zip");
									});
									
									return <div>
										<div className="flex justify-end mb-2">
											<Button iconStart={'file'} onClick={downloadZip}>Descargar Todo</Button>
										</div>
										<Table striped={false} lined={true}
											tableData={items}
											queryData={queryData}
											onSort={(e) => {
												setOrder(e.order);
												setSort(e.sort);
											}}
											tableHead={searchParams.tableHead}
										// tableActions={searchParams.tableActions}
										// isTableActionsCompressed={false}
										/>
									</div>
								}}
							/>
						}
					</Container>

				</div>
			</article>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Tickets',
	role: 'VISITOR'
}
export default Page
