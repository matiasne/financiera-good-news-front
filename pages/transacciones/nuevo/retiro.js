import Form from '@/components/forms/FormMovRetiro'
import MainLayout from '@/components/layout/MainLayout'

const Page = (props) => {
	return <Form {...props} />
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Nuevo Retiro'
}
export default Page
