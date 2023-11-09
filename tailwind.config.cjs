/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#0fdcfc',

					secondary: '#bae4ff',

					accent: '#e07fd3',

					neutral: '#15181e',

					'base-100': '#f1f1f4',

					info: '#7393d3',

					success: '#128144',

					warning: '#9b7a0d',

					error: '#fb4e4b'
				}
			}
		]
	}
};

module.exports = config;
