'use client';
import Button from '../components/UI/Button';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch } from '@/store/hooks';
import { switchToMainApp } from '@/store/route-slice';
import { useRouter, redirect } from 'next/navigation';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [loading, setLoading] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [logged, setLogged] = useState<boolean | undefined>(undefined);
	const router = useRouter();

	const signInHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setLoading(true);
			await signInWithEmailAndPassword(auth, email, password1);
			setLoading(false);
		} catch (error: any) {
			console.error(error);
			setLoading(false);
			if (error.code === 'auth/user-not-found') {
				setEmailError('Użytkownik nie znaleziony');
				setPasswordError('');
			} else if (error.code === 'auth/wrong-password') {
				setPasswordError('Błędne hasło');
			} else if (error.code === 'auth/invalid-email') {
				setEmailError('Błędny adres email');
			}
		}
	};
	useEffect(() => {
		if (logged) router.push('/');
	}, [logged, router]);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			user ? setLogged(true) : setLogged(false);
		});
		return () => unsubscribe();
	}, []);

	if (logged === undefined) {
		return null;
	} else if (!logged) {
		return (
			<div className='flex flex-col items-center my-8'>
				<h2 className='text-xl lett tracking-wide'>
					{!loading ? 'Logowanie' : 'Ładowanie...'}
				</h2>
				<form
					className='flex flex-col items-center mt-4'
					onSubmit={signInHandler}>
					<div className='p-4'>
						<input
							className='py-2 px-4 text-slate-700'
							type='text'
							id='username'
							name='username'
							placeholder='Email:'
							onChange={e => setEmail(e.target.value)}
							value={email}
						/>
					</div>
					<div className='px-4 text-red-500 w-full text-xs sm:text-sm'>
						{emailError}
					</div>
					<div className='p-4'>
						<input
							className='py-2 px-4 text-slate-700'
							type='password'
							id='password'
							name='password'
							placeholder='Hasło:'
							onChange={e => setPassword1(e.target.value)}
							value={password1}
						/>
						<div className='px-4 text-red-500 w-full text-xs sm:text-sm'>
							{passwordError}
						</div>
					</div>
					<p className='w-full text-sm text-left px-4 mt-4'>
						Nie masz konta?
						<Link href='/Register'>
							<button className='text-green-500 font-bold ml-2 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
								Zarejestruj się
							</button>
						</Link>
					</p>
					<div className='flex justify-between w-full p-4 mt-4 '>
						<Link href='/'>
							<button>
								<FontAwesomeIcon
									className='w-8 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
									icon={faArrowLeft}
								/>
							</button>
						</Link>

						<Button
							text={'Zaloguj'}
							backgroundColor={'bg-blue-500'}
						/>
					</div>
				</form>
			</div>
		);
	} else {
		return;
	}
};

export default Login;
