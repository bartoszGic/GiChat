'use client';
import Button from '../components/UI/Button';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadUser } from '@/store/auth-slice';
import { useRouter, redirect } from 'next/navigation';
import { getDoc, doc } from 'firebase/firestore';

const Login = () => {
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
					</div>
					<div className='px-4 text-red-500 w-full text-xs sm:text-sm'>
						{passwordError}
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
