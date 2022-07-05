import FormCliente from '@/components/forms/FormClient'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <FormCliente {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Editar Cliente'
}
export default Page
