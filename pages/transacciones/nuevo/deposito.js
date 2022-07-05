import FormMovDeposito from '@/components/forms/FormMovDeposito'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <FormMovDeposito {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Nuevo Depósito'
}
export default Page
