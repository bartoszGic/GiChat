'use client';
import Button from './components/UI/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import { useAppSelector } from '@/store/hookszzz';
import { useAppSelector } from '@/store';
import MainApp from './components/MainApp';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
// import { useRouter } from 'next/navigation';

type HomeProps = {};
const Home = () => {
	// console.log('Home');
	const [mainApp, setMainApp] = useState<null | boolean>(null);
	const auth = useAppSelector(state => state.auth);

	useEffect(() => {
		auth.uid !== null ? setMainApp(true) : setMainApp(false);
	}, [auth.uid]);

	if (mainApp === null) {
		return null;
	} else if (!mainApp) {
		return (
			<div className='flex flex-col items-center mt-2'>
				<header className='flex flex-col items-center my-12'>
					<h1 className='text-4xl font-bold tracking-widest'>GiChat</h1>
				</header>
				<p className='text-center mx-4'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, in!
				</p>
				<Link
					href='/Login'
					className='mt-12'>
					<button className='bg-cyan-500 px-12 py-4 relative group rounded-full font-medium text-gray-50 inline-block'>
						<span
							className={`absolute rounded-full top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-gray-950 group-hover:h-full group-hover:scale-105`}></span>
						<span className='relative text-xl tracking-widest'>Login</span>
					</button>
				</Link>
			</div>
		);
	} else {
		return <MainApp />;
	}
};

export default Home;
