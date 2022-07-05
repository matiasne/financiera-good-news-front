import FormProvider from '@/components/forms/FormProvider'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <FormProvider {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Editar Proveedor'
}
export default Page
