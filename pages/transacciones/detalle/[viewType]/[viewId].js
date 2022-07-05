import { parseDatetime, parseDtype, parseMoney } from '@/adapters/Parsers'
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
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PillSwitcher } from 'react-pill-switcher'
import { useMutation } from 'react-query'
import { CSSTransition, SwitchTransition } from "react-transition-group"
import Modal from 'react-gold-modal'
import { Card_Persona_Small } from '@/components/Cards'

import { styles } from '@/adapters/PDFStyles'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer'

// import OSR from '@/styles/fonts/OpenSans-Regular.ttf'


Font.register({
	family: 'Open Sans',
	fonts: [
		{ src: '/fonts/OpenSans-Regular.ttf' }, // font-style: normal, font-weight: normal
		{ src: '/fonts/OpenSans-Bold.ttf', fontWeight: 'bold' },
	]
});

const MyPage = ({ session }) => {
	const router = useRouter();
	const [pillValue, setPillValue] = useState('Todos');
	const [viewType, setViewType] = useState();
	const [viewId, setViewId] = useState();

	useEffect(() => {
		if (router.isReady) {
			setViewType(router.query.viewType);
			setViewId(router.query.viewId);
		}
	}, [router])

	const queryFullData = {
		'depositos': {
			singular: 'Depósito',
			id: 'depositoGet',
			detailBody: (data) => {
				return <>
					<View style={styles.container}>
						<View style={styles.col}>
							<View style={styles.card}>
								<Text style={styles.label}>Cliente</Text>
								<Text style={styles.cardP}>{data.customer.name}</Text>
							</View>
						</View>
						<View style={styles.col}>
							<View style={styles.card}>
								<Text style={styles.label}>Cuenta Destino</Text>
								<Text style={styles.cardP}># {data.providerAccount.accountNumber}</Text>
							</View>
						</View>
					</View>

					<View style={styles.container}>
						<View style={styles.col}>
							<Text style={styles.label}>Fecha</Text>
							<Text style={styles.p}>{parseDatetime(data.createdAt)}</Text>
						</View>
						<View style={styles.col}>
							<Text style={styles.label}>Monto</Text>
							<Text style={styles.p}>{parseMoney(data.total)}</Text>
						</View>
						<View style={styles.col}>
							<Text style={styles.label}>Comprobante</Text>
							<Text style={styles.p}># {data.internalId}</Text>
						</View>
						<View style={styles.col}>
							<Text style={styles.label}>CUIT</Text>
							<Text style={styles.p}>{data.cuit || '-'}</Text>
						</View>
					</View>

					<View style={styles.container}>
						<View style={styles.col}>
							<Text style={styles.label}>Notas</Text>
							<Text style={styles.p}>{data.notes || '-'}</Text>
						</View>
					</View>
				</>
			}
		},
		'retiros': {
			singular: 'Retiro',
			id: 'retiroGet',
			detailBody: (data) => {
				return <>
					<View style={styles.container}>
						<View style={styles.col}>
							<View style={styles.card}>
								<Text style={styles.label}>Cliente</Text>
								<Text style={styles.cardP}>{data.customer.name}</Text>
							</View>
						</View>
						<View style={styles.col}>
							<View style={styles.card}>
								<Text style={styles.label}>Envío</Text>
								<Text style={styles.cardP}>{data.paymentIntention ? '# ' + data.paymentIntention?.id : '-'}</Text>
							</View>
						</View>
					</View>

					<View style={styles.container}>
						<View style={styles.col}>
							<Text style={styles.label}>Fecha</Text>
							<Text style={styles.p}>{parseDatetime(data.createdAt)}</Text>
						</View>
						<View style={styles.col}>
							<Text style={styles.label}>Monto</Text>
							<Text style={styles.p}>{parseMoney(data.total)}</Text>
						</View>
						<View style={styles.col}>
							<Text style={styles.label}>Destinatario</Text>
							<Text style={styles.p}>{data.paymentIntention  ? data.paymentIntention?.receiverName + ' (' + data.paymentIntention?.receiverDocument + ')' : '-'}</Text>
						</View>
					</View>

					<View style={styles.container}>
						<View style={styles.col}>
							<Text style={styles.label}>Notas</Text>
							<Text style={styles.p}>{data.notes || '-'}</Text>
						</View>
					</View>
				</>
			}
		},
		'pagoProveedor': {
			singular: 'Pago Proveedor',
			id: 'pagoProveedorGet',
			detailBody: (data) => {
				return <>
					<View style={styles.container}>
						<View style={styles.col}>
							<View style={styles.card}>
								<Text style={styles.label}>Proveedor</Text>
								<Text style={styles.cardP}>{data.provider.name}</Text>
							</View>
						</View>
						<View style={styles.col}>

						</View>
					</View>

					<View style={styles.container}>
						<View style={styles.col}>
							<Text style={styles.label}>Fecha</Text>
							<Text style={styles.p}>{parseDatetime(data.createdAt)}</Text>
						</View>
						<View style={styles.col}>
							<Text style={styles.label}>Monto</Text>
							<Text style={styles.p}>{parseMoney(data.total)}</Text>
						</View>
						<View style={styles.col}>

						</View>
					</View>

					<View style={styles.container}>
						<View style={styles.col}>
							<Text style={styles.label}>Notas</Text>
							<Text style={styles.p}>{data.notes || '-'}</Text>
						</View>
					</View>
				</>
			}
		},
	}

	if (!router || !router.isReady || !viewType || !viewId) return <></>

	return (
		<>
			<QueryContent id={queryFullData[viewType].id} session={session}
				queryData={viewId}
				content={(data) => {
					return <div className='w-full h-full absolute'>
						<PDFViewer style={{ height: '100%', width: '100%' }}>
							<Document title={"Financiera Good News - Detalle de " + parseDtype(data.dtype, false) + " #" + data.id}>
								<Page size="A4" style={styles.page}>
									<View style={styles.containerHead}>
										<View style={styles.col}>
											<Text style={styles.title}>Detalle de {parseDtype(data.dtype, false)}</Text>
											<Text style={styles.subtitle}>#{data.id}</Text>
										</View>
									</View>

									{/* <View style={styles.container}>
										<View style={styles.col}>
											<Text style={styles.label}>Socio</Text>
											<Text style={styles.p}>{'-'}</Text>
										</View>
									</View> */}

									{queryFullData[viewType].detailBody(data)}

								</Page>
							</Document>

						</PDFViewer>
					</div>
				}}
			/>
		</>
	);
}

MyPage.layout = MainLayout;
MyPage.layoutProps = {
	title: 'Detalle de Transacción',
	hasBackLink: true,
}
export default MyPage
