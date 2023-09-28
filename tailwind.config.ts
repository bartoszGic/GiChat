import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			boxShadow: {
				btnShaddow: 'inset 6.5em 0 0 0 var(slate-100)',
			},
			keyframes: {
				animeBtn: {
					'0%': {
						transform: 'scale(1)',
					},
					'100%': {
						transform: 'scale(.9)',
					},
				},
				animeOffBtn: {
					'0%': {
						transform: 'scale(.9)',
					},
					'100%': {
						transform: 'scale(1)',
					},
				},
			},
			animation: {
				animeBtn: 'animeBtn .2s ease-in-out forwards',
				animeOffBtn: 'animeOffBtn .2s ease-in-out forwards',
			},
		},
	},
	plugins: [],
};
export default config;
