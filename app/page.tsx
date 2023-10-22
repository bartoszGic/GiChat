'use client';
import Button from './components/UI/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import { useAppSelector } from '@/store/hooks';
import MainApp from './components/Main/MainApp';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
// import { useRouter } from 'next/navigation';

type HomeProps = {};
const Home = () => {
	const [mainApp, setMainApp] = useState<undefined | boolean>(undefined);
	// const route = useAppSelector(state => state.route.mainApp);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			user ? setMainApp(true) : setMainApp(false);
		});
		return () => unsubscribe();
	}, []);

	if (mainApp === undefined) {
		return null;
	} else if (!mainApp) {
		return (
			<div className='flex flex-col items-center mt-2'>
				<header className='flex flex-col items-center my-8'>
					<h1 className='text-4xl font-bold tracking-widest'>GiChat</h1>
				</header>
				<p className='text-center mx-4'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, in!
				</p>
				<Link
					href='/Login'
					className='mt-8'>
					<Button
						text={'Login'}
						backgroundColor={'bg-blue-500'}
					/>
				</Link>
			</div>
		);
	} else {
		return <MainApp />;
	}
};

export default Home;
