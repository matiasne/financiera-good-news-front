import { parseDate, parseDatetime, parseDtype, parseMoney } from '@/adapters/Parsers'
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
import { Page, Text, View, Document, StyleSheet, Line } from '@react-pdf/renderer';
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
	const [filters, setFilters] = useState({});
	const [urlData, setUrlData] = useState({});
	const [entity, setEntity] = useState({});

	const mutationGetC = useMutation((personId) => {
		return axios(getQueryFullData('clientGet', personId, session))
	}, {
		onSuccess: (data) => {
			setEntity(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const mutationGetP = useMutation((personId) => {
		return axios(getQueryFullData('providerGet', personId, session))
	}, {
		onSuccess: (data) => {
			setEntity(data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})


	

	useEffect(() => {
		
		if (router.isReady) {
			
			if (router.query?.personType === "Cliente")
				mutationGetC.mutate(router.query?.personId);
			
	
			if (router.query?.personType === "Proveedor")
				mutationGetP.mutate(router.query?.personId);

			console.log(entity)
			setFilters({
				personId: router.query?.personId,
				from: router.query?.from,
				to: router.query?.to,
				providerAccountId: router.query?.providerAccountId || [],
			})
			setUrlData({
				personType: router.query?.personType,
				personName: router.query?.personName,
			})
		}
	}, [router])

	if (!router || !router.isReady) return <></>

	let fechaShow = '-';
	if (filters.from) {
		fechaShow = parseDate(filters.from);
	}
	if (filters.to) {
		// if (!filters.from) fechaShow = '';
		fechaShow += ' al ' + parseDate(filters.to);
	}

	return (
		<>
			<QueryContent id={"movimientoSearch"} session={session}
				queryData={{
					size: 100,
					sort: 'id',
					order: 'asc',
					...filters
				}}
				content={(data) => {
					return <div className='w-full h-full absolute'>
						<PDFViewer style={{ height: '100%', width: '100%' }}>
							<Document title={"Financiera Good News - Movimientos"}>
								<Page size="A4" style={styles.page}>
									<View style={styles.container}>
										<View style={styles.col}>
											<Text style={styles.title}>Detalle de Movimientos</Text>
											{urlData.personId && <Text style={styles.cardP}>{urlData.personType}: {urlData.personName}</Text>}
										</View>
									</View>
									<View style={styles.containerHead}>
										<View style={styles.col}>
											<Text style={styles.cardP}>{urlData.personType}:{urlData.personName}</Text>
										</View>
										<View style={styles.col}>
											<Text style={styles.cardP}>Fecha: {fechaShow}</Text>
										</View>
										<View style={styles.col}>
											<Text style={styles.cardP}>Saldo Ant.: {parseMoney(data.data[0]?.prevBalance)}</Text>
										</View>
									</View>
									<TableHeader />
									<ItemsTable data={data} entity={entity}/>
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
	title: 'Detalle de Movimiento',
	hasBackLink: true,
}
export default MyPage




const ItemsTable = ({ data, entity }) => {

	let cuponesPendientes = 0;
	data.data.map(item => {
		if (item.transactionStatus === 'PENDIENTE_DE_ACREDITACION' || item.transactionStatus === 'CUIT_INCORRECTO') cuponesPendientes += item.total;
	})

	return <View style={styles.tableContainer}>
		
		<Line />
		<TableRow items={data.data} />
		{/*<TableFooter items={data.items} />*/}

		<View style={styles.tr} key={'totales0'}></View>
		<View style={styles.tr} key={'totales1'}>
			<Text style={styles.tdTotal}>Saldo Pendiente</Text>
			<Text style={styles.thMONEY}>{parseMoney(entity.pendingBalance)}</Text>
		</View>		
		<View style={styles.tr} key={'totales2'}>
			<Text style={styles.tdTotal}>Total Cliente Cuenta Corriente en Pesos</Text>
			<Text style={styles.thMONEY}>{parseMoney(data.data[data.data.length - 1]?.balance)}</Text>
		</View>
		<View style={styles.tr} key={'totales3'}>
			<Text style={styles.tdTotal}>Total Cliente Excluyendo Cupones Pendientes</Text>
			<Text style={styles.thMONEY}>{parseMoney(data.data[data.data.length - 1]?.balance - cuponesPendientes)}</Text>
		</View>
	</View>
};

const TableRow = ({ items }) => {
	const rows = items.map((item) => (
		<View style={styles.tr} key={item.id.toString()}>
			<Text style={styles.thID}>{item.id}</Text>
			<Text style={styles.td}>{parseDatetime(item.createdAt)}</Text>
			<Text style={styles.td}>{item.concept}</Text>
			<Text style={styles.tdSM}>{item.personName}</Text>
			<Text style={styles.thMONEY}>{parseMoney(item.total)}</Text>
			<Text style={styles.thMONEY}>{parseMoney(item.total - ((item.total / 100) * item.fee ))}</Text>
			{/* <Text style={styles.thMONEY}>{parseMoney(item.prevBalance)}</Text> */}
			<Text style={styles.thMONEY}>{parseMoney(item.balance)}</Text>
		</View>
	));
	return <>{rows}</>;
};

const TableHeader = ({ items }) => {
	return <View style={styles.tr} key={"header"}>
		<Text style={styles.thID}>ID</Text>
		<Text style={styles.th}>Fecha</Text>
		<Text style={styles.th}>Concepto</Text>
		<Text style={styles.thSM}>Persona</Text>
		<Text style={styles.thMONEY}>Monto</Text>
		<Text style={styles.thMONEY}>Total</Text>
		{/* <Text style={styles.thMONEY}>Saldo Ant.</Text> */}
		<Text style={styles.thMONEY}>Balance</Text>
	</View>
};

// const tableHead = [
// 	{
// 		id: 'id',
// 		label: 'ID',
// 		type: 'id',
// 		getContent: (e) => e.id,
// 	},
// 	{
// 		id: 'createdAt',
// 		label: 'Fecha',
// 		type: 'id',
// 		getContent: (e) => parseDatetime(e.createdAt),
// 	},
// 	{
// 		id: 'concept',
// 		label: 'Concepto',
// 		type: 'text',
// 		getContent: (e) => e.concept,
// 		isSortable: false,
// 	},
// 	{
// 		id: 'personName',
// 		label: 'Persona',
// 		type: 'text',
// 		getContent: (e) => e.personName,
// 		isSortable: false,
// 	},
// 	{
// 		id: 'total',
// 		label: 'Monto',
// 		type: 'money',
// 		getContent: (e) => e.total,
// 		isSortable: false,
// 	},
// 	{
// 		id: 'balance',
// 		label: 'Balance',
// 		type: 'money',
// 		getContent: (e) => e.balance,
// 		isSortable: false,
// 	},
// ];
