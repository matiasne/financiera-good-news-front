import axios from 'axios';
import { setCookies } from 'cookies-next';
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
	providers: [
		Providers.Credentials({
			name: 'Credentials',
			credentials: {
				username: { label: "Username", type: "text", placeholder: "jsmith" },
				password: { label: "Password", type: "password" }
			},
			authorize: async (credentials) => {
				try {
					const data = {
						username: credentials.username,
						password: credentials.password
					}
					const result = await login(data);
					if (result) {
						// Any object returned will be saved in `user` property of the JWT
						const user = result.user;
						return Promise.resolve(user);
					} else {
						return Promise.resolve(null)
					}
				} catch (error) {
					if (error.response) {

						console.log(error.response);
						Promise.reject(new Error('Usuario o contraseña incorrectos'));
					}
				}
			}
		})
	],
	site: process.env.NEXTAUTH_URL,
	session: {
		jwt: true,
		maxAge: 12 * 60 * 60, // 12 hours
		updateAge: 12 * 60 * 60, // 12 hours
	},
	pages: {
		signIn: '/login',
		//signOut: '/auth/signout',
		//error: '/login', // Error code passed in query string as ?error=
		//verifyRequest: '/auth/verify-request', // (used for check email message)
		newUser: null // If set, new users will be directed here on first sign in
	},
	callbacks: {
		async jwt(token, user, account, profile) {
			if (user) {
				token.accessToken = user.token;
				token.username = user.username;
				// token.profile = profile;
			}
			return token
		},
		async session(session, token) {
			session.accessToken = token.accessToken;
			session.username = token.username;

			// session.user = {
			// 	name: profile.name,
			// 	// image: profile.image,
			// 	// username: profile.username,
			// 	userId: profile.id,
			// }
			return session
		}
	}
})

const login = async data => {
	var config = {
		headers: {
			'Content-Type': "application/json; charset=utf-8",
			'corsOrigin': '*',
			"Access-Control-Allow-Origin": "*"
		}
	};
	const url = process.env.DB_URL + '/login';

	try {

		let res = await axios.post(url, data, config);
		res.user = {
			token: res.headers.authorization,
			username: data.username
		}

		// let [res, res2] = await Promise.all([
		// 	axios.post(url, data, config),
		// 	axios.get(process.env.DB_URL + '/' + data.id)
		// ]);

		// res.user = {
		// 	name: res2.data.name,
		// 	// image: res2.data.profilePhotoUrl,
		// 	// username: data.username,
		// 	userId: res2.data.id,
		// 	token: res.headers.authorization
		// }

		return res
	} catch {
		return false
	}
};
