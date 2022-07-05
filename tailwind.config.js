const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const _ = require('lodash');


module.exports = {
	important: true,
	purge: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./adapters/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: false, // or 'media' or 'class'
	corePlugins: {
		container: false,
	},
	theme: {
		fontFamily: {
			display: ['Poppins', 'sans-serif'],
			base: ['Open Sans', 'sans-serif'],
			mono: ['Inconsolata', 'Consolas', 'mono']
		},
		fontSize: {
			'h1': ['3.81rem', '1em'],
			'h2': ['3.05rem', '1.5em'],
			'h3': ['2.44rem', '1.2em'],
			'h4': ['1.95rem', '1.2em'],
			'h5': ['1.56rem', '1.2em'],
			'h6': ['1.25rem', '1.2em'],
			'h7': ['1.125rem', '1.2em'],

			'base': ['.9rem', '1.4rem'],
			'button': ['1rem', '1em'],

			'sm': ['.875rem', '1rem'],
			'xs': ['.75rem', '1rem'],

			'icon': ['1.8rem', '1em'],
			'icon-lg': ['2rem', '1em'],
			'icon-sm': ['1.4rem', '1em'],
			'icon-xs': ['1.2rem', '1em'],
		},
		extend: {
			colors: {
				main: {
					DEFAULT: '#8C7AFC',
					'50': '#f3f4fa',
					'100': '#eae7fb',
					'200': '#d8c9fa',
					'300': '#c6aaf9',
					'400': '#b57efa',
					'500': '#9d61ff',
					'600': '#8b35f7',
					'700': '#6d2be8',
					'800': '#5525c4',
					'900': '#45209f',
				},
				'gray': {
					DEFAULT: '#ABB2BD',
					50: '#FAFAFF',
					100: '#F0F5FF',
					200: '#E1E6F5',
					300: '#CDD5E1',
					400: '#ABB2BD',
					500: '#8C929C',
					600: '#6B727A',
					700: '#4B5057',
					800: '#2D3238',
					900: '#222429',
				},
				'red': {
					...colors.rose,
					DEFAULT: colors.rose[500]
				},
				'blue': {
					...colors.sky,
					DEFAULT: colors.sky[500]
				},
				'yellow': {
					...colors.amber,
					DEFAULT: colors.amber[500]
				},
				'green': {
					...colors.emerald,
					DEFAULT: colors.emerald[400]
				}
			},
			shadowColors: {
				black: '#999999',
				dark: '#8396d5', //rgb(131, 150, 213)
				main: '#9d61ff',
				red: colors.rose[500],
				green: colors.green[400],
				yellow: colors.amber[500],
				blue: colors.sky[500],
			},
			spacing: {
				'n2': '-1rem',
				'n1': '-.5rem',
				0: '0',
				1: '.25rem',
				2: '.5rem',
				3: '1rem',
				4: '1.5rem',
				5: '2rem',
				6: '2.5rem',
				7: '3rem',
				8: '3.5rem',
				9: '4rem',
				10: '4.5rem',
				11: '5rem',
				12: '6rem',
			},
			boxShadow: {
				border: '0 0 0 1px rgba(var(--tw-shadow-color), .3)',
				'border-hard': '0 0 0 1px rgba(var(--tw-shadow-color), 1)',
				sm: `0 1px 3px rgba(var(--tw-shadow-color), .2), 0 4px 7px rgba(var(--tw-shadow-color), .1)`,
				DEFAULT: `0 1px 3px rgba(var(--tw-shadow-color), .2), 0 7px 15px rgba(var(--tw-shadow-color), .25)`,
				lg: `0 1px 3px rgba(var(--tw-shadow-color), .2), 0 12px 21px rgba(var(--tw-shadow-color), .3)`,
				xl: `0 2px 15px rgba(var(--tw-shadow-color), .2), 0 15px 30px rgba(var(--tw-shadow-color), .35)`,
				'2xl': `0 2px 15px rgba(var(--tw-shadow-color), .2), 0 15px 45px rgba(var(--tw-shadow-color), .35)`,
			},

		},
	},
	variants: {
		extend: {
			opacity: ['disabled'],
		},
	},
	plugins: [
		plugin(function ({ addUtilities, theme, e }) {
			const colorShadowUtilities = _.map(theme('shadowColors'), (value, key) => {
				let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
				let rgb = {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				};

				return {
					[':root']: {
						'--tw-shadow-color': '131, 150, 213'
					},
					[`.${e(`shadow-${key}`)}`]: {
						'--tw-shadow-color': `${rgb.r},${rgb.g},${rgb.b}`,
						// '--tw-shadow-color-5': `rgba(${rgb.r},${rgb.g},${rgb.b}, .1)`,
						// '--tw-shadow-color-10': `rgba(${rgb.r},${rgb.g},${rgb.b}, .35)`,
						// '--tw-shadow-color-20': `rgba(${rgb.r},${rgb.g},${rgb.b}, .5)`,
					}
				}

			})

			addUtilities(colorShadowUtilities, {
				respectImportant: false,
			})
		})
	],
}
