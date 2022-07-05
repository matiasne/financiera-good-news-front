import Headings from '@/adapters/Headings';
import Input from '@/components/base/Inputs';
import { Container } from '@/components/base/Grid';
import { csrfToken } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '@/components/base/Buttons';


function Login({ csrfToken }) {
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		username: '',
		password: '',
	});
	const router = useRouter();

	useEffect(() => {
		function handleEffect() {
			// console.log(router.query.error);
			if (router.query.error) {
				setMessage('Los datos ingresados no son correctos');
			}
		}

		handleEffect();
	}, [message]);

	function handleFormChange(e) {
		setForm({ ...form, [e.name]: e.value });
	}

	return (
		<>
			<Head>
				{
					Headings({
						pageTitle: 'Ingresar'
					})
				}
			</Head>

			<div className="bg-cover bg-center" style={{ backgroundImage: 'url(/main-bg.jpg)' }}>

				<Container size="xs" >
					<div className="h-screen w-full flex justify-center items-center flex-col gap-8">

						<div className="card w-full">

							<div className="p-4 px-8">
								<h1 className="h2 text-center text-h4 my-4">Iniciar Sesión</h1>

								<form className="flex flex-col gap-3" method='post' action='/api/auth/callback/credentials'>
									<input name='csrfToken' type='hidden' defaultValue={csrfToken} />

									{message != '' && <div className="message my-2 text-red text-center text-base font-semibold">{message}</div>}

									<Input type="text" label="Usuario o email" name="username" placeholder="Usuario" autoComplete={"username"} required value={form.username} onChange={handleFormChange} />
									<Input type="password" label="Contraseña" name="password" placeholder="Contraseña" autoComplete={"username"} required value={form.password} onChange={handleFormChange} />

									<div className="text-center my-4">
										<Button size="lg">Ingresar</Button>
									</div>
								</form>

							</div>

						</div>

						<h1 className="h4 text-white" style={{marginBottom: '-5rem'}}>Good News</h1>
					</div>
				</Container>
			</div>

		</>
	);
};



Login.getInitialProps = async (context) => {
	return {
		csrfToken: await csrfToken(context)
	}
}

export default Login
