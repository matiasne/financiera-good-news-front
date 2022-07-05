import Form from '@/components/forms/FormMovEnvio'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <Form {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Nuevo Envío'
}
export default Page
