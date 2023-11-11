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
