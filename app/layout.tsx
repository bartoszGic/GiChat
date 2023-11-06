'use client';
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { persistStore } from 'redux-persist';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
// 	title: 'GiChat',
// 	description: 'Generated by Next.js',
// };
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
				<title>GiChat</title>
			</head>
			<body
				className={`${inter.variable} font-sans bg-slate-700 text-slate-100`}>
				<Provider store={store}>
					<main className='relative flex flex-col max-w-4xl mx-auto h-screen'>
						{children}
					</main>
				</Provider>
			</body>
		</html>
	);
}
