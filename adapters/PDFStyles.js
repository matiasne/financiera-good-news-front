import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
	// VIEWS
	page: {
		flexDirection: 'column',
		padding: 10,
		paddingTop: 15,
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
		flexDirection: "col",
		flexWrap: "wrap",
		marginTop: 10,
	},
	tr: {
		width: '90%',
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		borderBottomStyle: 'solid',
		marginBottom: 4,
		paddingBottom: 4,
	},
	th: {

		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thConcept:{
		width: '20%',
		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	tdConcept:{
		textOverflow: 'ellipsis',
		width: '20%',
		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thID: {
		width: '5%',
		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thSM: {
		width: '10%',
		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	tdSM: {
		width: '10%',
		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thMONEY: {
		width: '15%',
		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		textAlign: 'right',
		paddingHorizontal: 4,
	},
	tdMONEY: {
		width: '15%',
		fontFamily: 'Open Sans',
		fontWeight: 'bold',
		fontSize: 8,
		color: '#787878',
		textAlign: 'right',
		paddingHorizontal: 4,
	},
	td: {
		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	thDate: {
		width: '15%',
		fontFamily: 'Open Sans',
		fontSize: 8,
		color: '#787878',
		paddingHorizontal: 2,
	},
	tdDate: {
		width: '15%',
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
