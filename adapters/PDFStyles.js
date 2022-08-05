import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
	// VIEWS
	page: {
		flexDirection: 'column',
		padding: 0,
		paddingLeft:30,
		paddingRight:30,
		paddingTop: 50,
		paddingBottom: 15,
	},
	container: {
		flexDirection: 'row',
	},
	containerHead: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		borderBottomStyle: 'solid',
		marginBottom: 5,
		paddingBottom: 5,
	},
	col: {
		padding: 10,
		flex: 1
	},

	// CARDS
	card: {
		padding: 10,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#ddd',
		borderStyle: 'solid',
		marginBottom: 5,
	},

	// TEXTS
	title: {
		fontFamily: 'Open Sans',
		fontSize: 24,
		color: '#787878',
		fontWeight: 'bold',
	},
	subtitle: {
		fontFamily: 'Open Sans',
		fontSize: 18,
		color: '#bbb',
		fontWeight: 'bold',
	},
	label: {
		fontFamily: 'Open Sans',
		fontSize: 10,
		color: '#787878',
		fontWeight: 'bold',
	},
	p: {
		fontFamily: 'Open Sans',
		fontSize: 10,
		color: '#787878'
	},
	cardP: {
		fontFamily: 'Open Sans',
		fontSize: 15,
		color: '#787878'
	},

	// TABLE
	tableContainer: {
		width: 600,
		marginTop: 10,
	},
	totales:{
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		borderBottomStyle: 'solid',
		marginBottom: 14,
		marginRight: 60,
		paddingBottom: 14,
	},
	tr: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		borderBottomStyle: 'solid',
		marginBottom: 14,

		paddingBottom: 14,
	},
	th: {
		width: "18%",

		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thID: {
		width: 30,

		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thSM: {
		width: 50,

		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thMONEY: {
		width: 90,

		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		textAlign: 'right',
		paddingHorizontal: 2,
	},
	td: {
		width: "18%",

		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	tdSM: {
		width: 50,

		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thDate: {	
		width: 70,
		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	tdDate: {	
		width: 70,
		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thConcept: {	
		width: 110,
		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	tdConcept: {	
		width: 110,
		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	tdTotal: {
		width: "82%",

		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
		textAlign: 'right',
	},
});
