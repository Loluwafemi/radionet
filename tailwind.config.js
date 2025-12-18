/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				glass: {
					light: 'rgba(255, 255, 255, 0.1)',
					dark: 'rgba(0, 0, 0, 0.3)'
				}
			}
		}
	},
	plugins: []
};