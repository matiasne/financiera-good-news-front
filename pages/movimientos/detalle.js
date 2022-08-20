import {
	parseDate,
	parseDatetime,
	parseDtype,
	parseMoney,
	parseTotalMoney,
} from "@/adapters/Parsers";
import QueryContent, {
	getQueryFullData,
} from "@/adapters/Querys";
import Spinner from "@/components/base/Spinner";
import MainLayout from "@/components/layout/MainLayout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

import { styles } from "@/adapters/PDFStyles";
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Line,
} from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";

// import OSR from '@/styles/fonts/OpenSans-Regular.ttf'

const TransactionStatusTypes = {
	INGRESADO: "INGRESADO",
	PENDIENTE_DE_ACREDITACION: "PENDIENTE_DE_ACREDITACION",
	CUIT_INCORRECTO: "CUIT_INCORRECTO",
	PAYMENT: "PAYMENT",
	PROVIDER_CASH_DELIVERY: "PROVIDER_CASH_DELIVERY",
	CONFIRMADO: "CONFIRMADO",
	RECHAZADO: "RECHAZADO",
	ERROR_DE_CARGA: "ERROR_DE_CARGA",
};

Font.register({
	family: "Open Sans",
	fonts: [
		{ src: "/fonts/OpenSans-Regular.ttf" }, // font-style: normal, font-weight: normal
		{ src: "/fonts/OpenSans-Bold.ttf", fontWeight: "bold" },
	],
});

const MyPage = ({ session }) => {
	const [pageIsReady, setPageIsReady] = useState(false);

	const router = useRouter();
	const [urlData, setUrlData] = useState({});

	const [MovementsIngresados, setMovementsIngresados] = useState();
	const [MovementsRetirosYPagos, setMovementsRetirosYPagos] = useState();
	const [MovementsErrorDeCarga, setMovementsErrorDeCarga] = useState();
	const [MovementsPendientes, setMovementsPendientes] = useState();
	const [MovementsRechazados, setMovementsRechazados] = useState();

	const [saldoPendiente, setSaldoPendiente] = useState(0);
	const [balanceFinal, setBalanceFinal] = useState(0);
	const [balanceInicial, setBalanceInicial] = useState(0);
	const [movimientos, setMovimientos] = useState([]);

	const [cantidadIngresadosConfirmados, setCantidadIngresadosConfirmados] = useState([]);
	const [montoTotalDeDeposito, setMontoTotalDeDeposito] = useState([]);

	const getMovementsIngresados = useMutation(filters => {
		return axios(getQueryFullData('movimientoSearch', {
			sort: "id",
			order: "asc",
			from: filters.from,
			to: filters.to,
			personId: filters.personId,
			status: [TransactionStatusTypes.INGRESADO],
		}, session))
	}, {
		onSuccess: (data) => {
			setMovementsIngresados(data.data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const getMovementsRetirosYPagos = useMutation(filters => {
		return axios(getQueryFullData('movimientoSearch', {
			sort: "id",
			order: "asc",
			from: filters.from,
			to: filters.to,
			personId: filters.personId,
			status: [
				TransactionStatusTypes.PAYMENT,
				TransactionStatusTypes.PROVIDER_CASH_DELIVERY,
			],
		}, session))
	}, {
		onSuccess: (data) => {
			setMovementsRetirosYPagos(data.data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const getMovementsErrorDeCarga = useMutation(filters => {
		return axios(getQueryFullData('movimientoSearch', {
			sort: "id",
			order: "asc",
			from: filters.from,
			to: filters.to,
			personId: filters.personId,
			status: [TransactionStatusTypes.ERROR_DE_CARGA],
		}, session))
	}, {
		onSuccess: (data) => {
			setMovementsErrorDeCarga(data.data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const getMovementsPendientes = useMutation(filters => {
		return axios(getQueryFullData('movimientoSearchPendientes', {
			sort: "id",
			order: "asc",
			to: filters.to,
			personId: filters.personId,
			status: [TransactionStatusTypes.PENDIENTE_DE_ACREDITACION, TransactionStatusTypes.CUIT_INCORRECTO],
		}, session))
	}, {
		onSuccess: (data) => {
			setMovementsPendientes(data.data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	const getMovementsRechazados = useMutation(filters => {
		return axios(getQueryFullData('movimientoSearch', {
			sort: "id",
			order: "asc",
			from: filters.from,
			to: filters.to,
			personId: filters.personId,
			status: [TransactionStatusTypes.RECHAZADO],
		}, session))
	}, {
		onSuccess: (data) => {
			setMovementsRechazados(data.data.data);
		},
		onError: (err) => {
			console.log(err);
		}
	})

	useEffect(() => {
		// detalle?personId=103&personType=Cliente&personName=Cenitho&providerAccountId=&from=2022-07-01T00%3A00%3A00.000Z&
		if (router.isReady) {
			const urlData = {
				personType: router.query?.personType,
				personName: router.query?.personName,
			}
			const filters = {
				personId: router.query?.personId,
				from: router.query?.from,
				to: router.query?.to,
				providerAccountId: router.query?.providerAccountId || [],
			};

			getMovementsIngresados.mutate(filters);
			getMovementsRetirosYPagos.mutate(filters);
			getMovementsErrorDeCarga.mutate(filters);
			getMovementsPendientes.mutate(filters);
			getMovementsRechazados.mutate(filters);

			setUrlData(urlData);
		}
	}, [router]);

	useEffect(() => {
		if (MovementsIngresados && MovementsErrorDeCarga && MovementsPendientes && MovementsRechazados && MovementsRetirosYPagos) {
			parseData();
		}
	}, [MovementsIngresados, MovementsErrorDeCarga, MovementsPendientes, MovementsRetirosYPagos, MovementsRechazados])

	useEffect(() => {
		setPageIsReady(true);
	}, [movimientos]);

	function parseData() {
		let movements = [];
		let confirmados = MovementsIngresados;
		let salidas = MovementsRetirosYPagos;
		let erroresDeCarga = MovementsErrorDeCarga;
		let pendientes = MovementsPendientes;
		let rechazados = MovementsRechazados;

		let balanceInicial = confirmados[0]?.prevBalance + confirmados[0]?.pendingBalance;
		setBalanceInicial(balanceInicial);

		let found = false;
		let balance = balanceInicial;

		let montoTotalDeDeposito = 0;
		let countConfirmados = 0;
		confirmados.forEach(confirmado => {
			found = erroresDeCarga.find((x) => x.transactionId === confirmado.transactionId);
			if (!found) {
				found = movements.find((x) => x.transactionId === confirmado.transactionId);
				if (!found) {
					balance += (confirmado.total * (100 - confirmado.fee)) / 100;
					confirmado.balance = balance;
					montoTotalDeDeposito += confirmado.total;
					countConfirmados++;
					movements.push(confirmado);
				}
			}
		});
		setCantidadIngresadosConfirmados(countConfirmados);
		setMontoTotalDeDeposito(montoTotalDeDeposito);

		salidas.forEach(salida => {
			balance -= (salida.total * (100 - salida.fee)) / 100;
			salida.balance = balance;
			salida.total = salida.total * -1;
			movements.push(salida);
		});

		let saldoPendiente = 0;
		let total = 0;
		pendientes.forEach(pendiente => {
			total = (pendiente.total * (100 - pendiente.fee)) / 100;
			balance -= total
			pendiente.balance = balance
			saldoPendiente += total;
			pendiente.total = pendiente.total * -1;
			movements.push(pendiente);
		});
		setSaldoPendiente(saldoPendiente);

		rechazados.forEach(rechazado => {
			balance -= (rechazado.total * (100 - rechazado.fee)) / 100;
			rechazado.balance = balance;
			rechazado.total = rechazado.total * -1;
			movements.push(rechazado);
		});

		erroresDeCarga.forEach(errorDeCarga => {
			found = confirmados.find((x) => x.transactionId === errorDeCarga.transactionId);
			if (!found) {
				balance -= (errorDeCarga.total * (100 - errorDeCarga.fee)) / 100;
				errorDeCarga.balance = balance;
				errorDeCarga.total = errorDeCarga.total * -1;
				movements.push(errorDeCarga);
			}
		});
		setBalanceFinal(balance)
		setMovimientos(movements);
	}

	let fechaShow = "-";
	if (router?.query.from) {
		fechaShow = parseDate(router?.query.from);
	}
	if (router?.query.to) {
		fechaShow += " al " + parseDate(router?.query.to);
	}

	if (!pageIsReady) {
		return <Spinner />
	}

	return (
		<div className="w-full h-full absolute">
			<PDFViewer style={{ height: "100%", width: "100%" }}>
				<Document title={"Financiera Good News - Movimientos"}>
					<Page size="A4" style={styles.page}>
						<View style={styles.container}>
							<View style={styles.col}>
								<Text style={styles.title}>Detalle de Movimientos</Text>
								{urlData.personId && (
									<Text style={styles.cardP}>
										{urlData.personType}: {urlData.personName}
									</Text>
								)}
							</View>
						</View>

						<View style={styles.rowHeader}>
							<View style={styles.colLeft}>
								<Text style={styles.cardP}>
									{urlData.personType}: {urlData.personName}{" "}
								</Text>
							</View>
						</View>
						<View style={styles.rowHeader}>
							<View style={styles.colLeft}>
								<Text style={styles.cardP}>Fecha: {fechaShow} </Text>
							</View>
						</View>
						<View style={styles.rowHeader}>
							<View style={styles.colLeft}>
								<Text style={styles.cardP}>
									Cantidad de depósitos: {cantidadIngresadosConfirmados}{" "}
								</Text>
							</View>
						</View>
						<View style={styles.rowHeader}>
							<View style={styles.colRight}>
								<Text style={styles.cardP}>
									Monto total de depósitos: {parseMoney(montoTotalDeDeposito)}
								</Text>
							</View>
							<View style={styles.colRight}>
								<Text style={styles.cardP}>
									Saldo Ant.: {parseMoney(balanceInicial)}
								</Text>
							</View>
						</View>

						<TableMovimientos data={movimientos} />

						<FooterTotals
							saldoPendiente={saldoPendiente}
							balanceFinal={balanceFinal}
						/>
					</Page>
				</Document>
			</PDFViewer>
		</div>
	);
};

MyPage.layout = MainLayout;
MyPage.layoutProps = {
	title: "Detalle de Movimiento",
	hasBackLink: true,
};
export default MyPage;

const TableMovimientos = ({ data }) => {
	return data.length ? (
		<View style={styles.tableContainer}>
			<TableHeader />
			<Line />
			<TableRow items={data} />
		</View>
	) : null;
};

const TableHeader = () => {
	return (
		<View style={styles.tr} key={"header"}>
			<Text style={styles.thID}>ID</Text>
			<Text style={styles.thDate}>Fecha</Text>
			<Text style={styles.thConcept}>Concepto</Text>
			<Text style={styles.thSM}>Persona</Text>
			<Text style={styles.thMONEY}>Monto</Text>
			<Text style={styles.thMONEY}>Total</Text>
			{/* <Text style={styles.thMONEY}>Saldo Ant.</Text> */}
			<Text style={styles.thMONEY}>Balance</Text>
		</View>
	);
};

const TableRow = ({ items }) => {
	const rows = items?.map((item) => (
		<View style={styles.tr} key={item.id.toString()}>
			<Text style={styles.thID}>{item.id}</Text>
			<Text style={styles.tdDate}>{parseDate(item.createdAt)}</Text>
			<Text style={styles.tdConcept}>{item.concept}</Text>
			<Text style={styles.tdSM}>{item.personName}</Text>
			<Text style={styles.thMONEY}>{parseMoney(Math.abs(item.total))}</Text>
			<Text style={styles.thMONEY}>
				{parseTotalMoney((item.total * (100 - item.fee)) / 100)}
			</Text>
			{/* <Text style={styles.thMONEY}>{parseMoney(item.prevBalance)}</Text> */}
			<Text style={styles.thMONEY}>{parseMoney(item.balance)}</Text>
		</View>
	));
	return <>{rows}</>;
};

const FooterTotals = ({ saldoPendiente, balanceFinal }) => {
	return (
		<View style={styles.totalesContainer}>
			<View style={styles.totales} key={"totales3"}>
				<Text style={styles.tdTotal}>Total Excluyendo Cupones Pendientes</Text>
				<Text style={styles.tdTotalValue}>{parseMoney(balanceFinal)}</Text>
			</View>
			<View style={styles.totales} key={"totales1"}>
				<Text style={styles.tdTotal}>Saldo Pendiente</Text>
				<Text style={styles.tdTotalValue}>{parseMoney(saldoPendiente)}</Text>
			</View>
			<View style={styles.totales} key={"totales2"}>
				<Text style={styles.tdTotal}>
					Total Cuenta Corriente en Pesos
				</Text>
				<Text style={styles.tdTotalValue}>
					{parseMoney(saldoPendiente + balanceFinal)}
				</Text>
			</View>
		</View>
	);
};