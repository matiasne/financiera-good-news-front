import FormProvider from '@/components/forms/FormProviderAccounts'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <FormProvider {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Editar Cuentas de Proveedor'
}
export default Page
