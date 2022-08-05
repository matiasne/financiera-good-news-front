export function parseMoney(x, hasCents = true) {
	return '$ ' + parseThousands(x, hasCents);
}

export function parseThousands(x, hasCents = false) {
	if (!x) {
		return 0;
	}
	// let money = Intl.NumberFormat('es-AR', {
	let money = Intl.NumberFormat('fr-BE', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	let result = money.format(parseFloat(x)).replaceAll(' ', ' ').replace(',', '.');
	if (!hasCents) result = money.format(Math.floor(x))

	return result;
}

export function parseTitle(str) {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	// Directly return the joined string
	return splitStr.join(' ');
}

export function parseDate(date) {
	if (date !== null) {
		let myDate = new Date(date);
		return numberFormat(myDate.getUTCDate()) + '/' + numberFormat(myDate.getUTCMonth() + 1) + '/' + myDate.getUTCFullYear();
	} else {
		return '-'
	}
}

export function parseDatetime(date) {
	if (date !== null) {
		let myDate = new Date(date);
		let newDate = numberFormat(myDate.getDate()) + '/' + numberFormat(myDate.getMonth() + 1) + '/' + myDate.getFullYear(); // DD MM AAAA
		let newTime = numberFormat(myDate.getHours()) + ':' + numberFormat(myDate.getMinutes());
		return newDate + ' ' + newTime;

	} else {
		return '-'
	}
}


function numberFormat(x = 0) {
	return ("0" + x).slice(-2);
}

export function parseDtype(dtype = '', plural = false, linkFriendly = false) {
	let res = '';
	switch (dtype) {
		case 'Deposit':
			res = plural ? 'Depósitos' : 'Depósito'
			if (linkFriendly) res = res.replace('ó', 'o')
			break;

		case 'Payment':
			res = plural ? 'Retiros' : 'Retiro'
			break;

		case 'ProviderCashDelivery':
			res = plural ? 'Pagos Proveedores' : 'Pago Proveedor'
			if (linkFriendly) res = res.replace(' ', '')
			break;

		default:
			res = dtype
			break;
	}

	if (linkFriendly) return res.toLowerCase()

	return res;
}

export function parseStatus(status = '', color = false) {
	let res = '';
	let ballColor = 'bg-green';
	switch (status) {
		case 'INGRESADO':
			res = 'Ingresado'
			break;

		case 'CONFIRMADO':
			res = 'Confirmado'
			break;

		case 'RECHAZADO':
			res = 'Rechazado'
			ballColor = 'bg-red';
			break;

		case 'ERROR_DE_CARGA':
			res = 'Error de Carga'
			ballColor = 'bg-red';
			break;

		case 'CUIT_INCORRECTO':
			res = 'CUIT Incorrecto';
			ballColor = 'bg-red';
			break;

		case 'PENDIENTE_DE_ACREDITACION':
			res = 'Pendiente de Acreditación';
			ballColor = 'bg-yellow';
			break;

		default:
			res = status
			break;
	}

	if (color) {
		return <span className={"text-sm text-white p-1 px-2 rounded-md " + ballColor}>{res}</span>
	}

	return res;
}

export function forceTime(datetime, dayStart = true) {
	{/* 2022-04-25T17:57:37.000Z */ }
	if (!datetime) return null;

	let date = new Date(datetime);

	if (dayStart) {
		date.setUTCHours(0, 0, 0, 0);
	} else {
		date.setUTCHours(23, 59, 59, 999);
	}
	return date.toISOString();
}

export function getToday() {

	let date = new Date();
	date.setHours(0, 0, 0, 0);
	console.log(date);
	return date;
}

export function getTimestamp() {
	let date = new Date();
	return date;
}

export function dataURLtoFile(dataurl, filename) {

	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}
