import Form from '@/components/forms/FormMovPagoProveedor'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <Form {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Nuevo Pago Proveedor'
}
export default Page
