'use client';
import Button from '../components/UI/Button';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadUser } from '@/store/auth-slice';
import { useRouter, redirect } from 'next/navigation';
import { getDoc, doc } from 'firebase/firestore';

const Login = () => {
	// console.log('Login');
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [loading, setLoading] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [logged, setLogged] = useState<boolean | null>(null);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const isAuth = useAppSelector(state => state.auth.uid);

	const signInHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setLoading(true);
			await signInWithEmailAndPassword(auth, email, password1);
			if (auth.currentUser !== null) {
				const actualUserDetails = await getDoc(
					doc(db, 'users', auth.currentUser.uid)
				);
				dispatch(
					loadUser({
						uid: auth.currentUser.uid,
						displayName: actualUserDetails.data()?.displayName,
						email: auth.currentUser.email,
						photoURL: actualUserDetails.data()?.photoURL,
					})
				);
			}
			setLoading(false);
		} catch (error: any) {
			console.error(error);
			setLoading(false);
			if (error) {
				setEmailError('Błędny email lub hasło');
				setPasswordError('Błędny email lub hasło');
			}
		}
	};

	useEffect(() => {
		if (isAuth !== null) {
			setLogged(true);
			router.push('/');
		} else setLogged(false);
	}, [isAuth, router]);

	if (logged === null) {
		return null;
	} else if (!logged) {
		return (
			<div className='flex flex-col items-center mt-8'>
				<h2 className='flex items-center justify-center h-6 text-xl'>
					{!loading ? (
						<span className='tracking-widest'>Logowanie</span>
					) : (
						<FontAwesomeIcon
							className='w-6 h-6 py-1 text-gray-50'
							icon={faSpinner}
							spin
						/>
					)}
				</h2>
				<form
					className='flex flex-col items-center mt-4'
					onSubmit={signInHandler}>
					<div className='p-4'>
						<input
							className='py-3 px-4 text-gray-700 rounded-full'
							type='text'
							id='username'
							name='username'
							placeholder='Email:'
							onChange={e => setEmail(e.target.value)}
							value={email}
						/>
					</div>
					<div className='pb-4 px-4 text-red-500 w-full text-xs sm:text-sm'>
						{emailError}
					</div>
					<div className='p-4'>
						<input
							className='py-3 px-4 text-gray-700 rounded-full'
							type='password'
							id='password'
							name='password'
							placeholder='Hasło:'
							onChange={e => setPassword1(e.target.value)}
							value={password1}
						/>
					</div>
					<div className='px-4 text-red-500 w-full text-xs sm:text-sm'>
						{passwordError}
					</div>
					<div className='flex w-full px-4 mt-8 text-sm'>
						<div className='flex flex-col justify-between w-full text-left'>
							<span className='mb-8'>Nie masz konta?</span>
							<Link
								className='flex h-full w-fit'
								href='/'>
								<button className='h-full'>
									<FontAwesomeIcon
										className='w-8 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
										icon={faArrowLeft}
									/>
								</button>
							</Link>
						</div>
						<div className='flex flex-col justify-between items-center w-full'>
							<Link href='/Register'>
								<button className='mb-8 text-cyan-500 font-bold animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn tracking-wider'>
									Zarejestruj się
								</button>
							</Link>
							<button className='bg-cyan-500 px-8 py-2 relative group rounded-full font-medium text-gray-50 inline-block'>
								<span
									className={`absolute rounded-full top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-gray-950 group-hover:h-full group-hover:scale-105`}></span>
								<span className='relative text-lg'>Zaloguj</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	} else {
		return;
	}
};

export default Login;
