import Headings from '@/adapters/Headings'
import Button from '@/components/base/Buttons'
import Col, { Container, Row } from '@/components/base/Grid'
import Input from '@/components/base/Inputs'
import Spinner from '@/components/base/Spinner'
import MainLayout from '@/components/layout/MainLayout'
import Head from 'next/head'
import router from 'next/router'
import { useState } from 'react'
import Modal from 'react-gold-modal'


const Page = () => {
	const [isConfirming, setConfirming] = useState(false);

	const handleOk = (e) => {
		e.preventDefault();
		setConfirming(true);
	};

	const handleCancel = (e) => {
		e.preventDefault();
		router.back();
	};

	return (
		<>
			<Head>
				{Headings('Nuevo Proveedor')}
			</Head>

			<article>
				<Container size="sm">

					<form className="py-8">
						<Row cols={6} gap={5} verticalGap >
							<Col span={3}>
								<Input type="text" label="Nombre y Apellido" name="name" />
							</Col>
							<Col span={3}>
								<Input type="text" label="Razón Social" name="social" />
							</Col>
							<Col span={2}>
								<Input type="email" label="Email" name="email" />
							</Col>
							<Col span={2}>
								<Input type="phone" label="Teléfono" name="phone" />
							</Col>
							<Col span={2}>
								<Input type="text" label="Direción" name="address" />
							</Col>
							<Col span={6}>
								<Input type="textarea" label="Notas" name="notes" />
							</Col>
						</Row>

						<div className="mt-6 flex gap-3 justify-center">
							<Button size="lg" variant="success" onClick={handleOk}>Confirmar</Button>
							<Button size="lg" variant="neutraldark" onClick={handleCancel}>Cancelar</Button>
						</div>
					</form>
				</Container>

				<Modal
					display={isConfirming}
					title={'Nuevo Proveedor'}
					description="¿Confirma que desea realizar esta acción?"
					className="text-button font-bold text-gray-500 py-4"
					options={[
						{
							text: 'Aceptar',
							handler: () => setConfirming(false),
						}
					]}
					cancel={{
						text: 'Cancelar',
						handler: () => setConfirming(false),
					}}
				/>

			</article>

		</>

	)
}

Page.layout = MainLayout;
Page.layoutProps = {
	title: 'Nuevo Proveedor'
}
export default Page
