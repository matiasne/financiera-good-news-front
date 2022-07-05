import FormClient from '@/components/forms/FormClientAccounts'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <FormClient {...props} />
}


Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Editar Comisiones de Cliente'
}
export default Page
