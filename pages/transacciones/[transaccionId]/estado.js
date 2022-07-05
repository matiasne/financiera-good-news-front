import FormMovDepositoEstado from '@/components/forms/FormMovDepositoEstado'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <FormMovDepositoEstado {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Editar Estado'
}
export default Page
