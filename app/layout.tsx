'use client';
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { persistStore } from 'redux-persist';

const inter = Inter({
	weight: ['100', '200', '300', '400', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
});
persistStore(store);
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='pl'>
			<head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
				/>
				<title>GiChat</title>
			</head>
			<body className={`${inter.variable} inter  bg-neutral-950 text-gray-50`}>
				<Provider store={store}>
					<main className='relative flex flex-col max-w-4xl mx-auto h-screen'>
						{children}
					</main>
				</Provider>
			</body>
		</html>
	);
}
