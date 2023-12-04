'use client';
import Button from '../components/UI/Button';
import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faUser,
	faUsers,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import {
	createUserWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth, storage, db } from '../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc, doc, getDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadUser } from '@/store/auth-slice';
import { useRouter, redirect } from 'next/navigation';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [avatar, setAvatar] = useState<File | undefined>();
	const [avatarURL, setAvatarURL] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [logged, setLogged] = useState<null | boolean>(null);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const isAuth = useAppSelector(state => state.auth.uid);
	const chat = useAppSelector(state => state.chat);

	const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			setAvatar(file);
			const reader = new FileReader();
			reader.onload = e => {
				if (e.target !== null) setAvatarURL(e.target.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	const createUserAcount = async (profile: any) => {
		const storageRef = ref(storage, `${email}_PROFILE_IMG`);
		try {
			const defautImg = await fetch('../user.png');
			const blob = await defautImg.blob();
			avatar !== undefined
				? await uploadBytesResumable(storageRef, avatar)
				: await uploadBytesResumable(storageRef, blob);
			const downloadURL = await getDownloadURL(storageRef);
			await updateProfile(profile.user, {
				displayName: email,
				photoURL: downloadURL,
			});
			const userData = {
				uid: profile.user.uid,
				displayName: email,
				email: email,
				photoURL: downloadURL,
			};
			dispatch(loadUser(userData));
			await setDoc(doc(db, 'users', profile.user.uid), userData);
			await setDoc(doc(db, 'userChats', profile.user.uid), {});
			await updateDoc(doc(db, 'userChats', chat.chatKey as string), {
				[`${chat.chatKey}.info.friendsInRoom`]: arrayUnion({
					displayName: email,
					uid: profile.user.uid,
					photoURL: downloadURL,
				}),
			});
			router.push('/');
		} catch (error) {
			console.log(error);
		}
	};

	const signUpHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (password1 !== password2)
				return setPasswordError('Hasła do siebie nie pasują');
			setLoading(true);
			const profile = await createUserWithEmailAndPassword(
				auth,
				email,
				password1
			);
			createUserAcount(profile);
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			if (error.code === 'auth/invalid-email') {
				setEmailError('Zły adres email');
				setPasswordError('');
			} else if (error.code === 'auth/weak-password') {
				setPasswordError('Minimum 6 znaków');
			} else if (error.code === 'auth/email-already-in-use') {
				setEmailError('Email w użyciu');
				setPasswordError('');
			}
		}
	};
	useEffect(() => {
		isAuth !== null ? setLogged(true) : setLogged(false);
	}, [isAuth]);

	if (logged === null) {
		return null;
	} else if (!logged) {
		return (
			<section className='flex flex-col items-center my-8'>
				<h2 className='text-xl lett tracking-wide'>
					{!loading ? 'Rejestracja' : 'Ładowanie...'}
				</h2>
				<form
					className='flex flex-col items-center mt-4'
					onSubmit={signUpHandler}>
					<input
						className='py-2 px-4 m-4 text-slate-700'
						type='text'
						id='username'
						name='username'
						placeholder='Email:'
						onChange={e => setEmail(e.target.value)}
						value={email}
					/>
					<div className='px-4 text-red-500 w-full text-xs sm:text-sm'>
						{emailError}
					</div>
					<input
						className='py-2 px-4 m-4 text-slate-700'
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
					<input
						className='py-2 px-4 m-4 text-slate-700'
						type='password'
						id='passwordConfirm'
						name='passwordConfirm'
						placeholder='Powtórz hasło:'
						onChange={e => setPassword2(e.target.value)}
						value={password2}
					/>
					<div className='px-4 text-red-500 w-full text-xs sm:text-sm'>
						{passwordError}
					</div>
					<label
						className='flex items-center w-full p-4'
						htmlFor='avatar'>
						<input
							onChange={handleAvatar}
							className='hidden'
							type='file'
							accept='image/*'
							id='avatar'
						/>
						<span className='flex items-center cursor-pointer animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
							Dodaj avatar
							{avatar === undefined || !avatarURL ? (
								<Image
									className='h-8 w-8 ml-2 align-middle rounded-full bg-center'
									src='/user.png'
									alt='avatar'
									width={40}
									height={40}
								/>
							) : (
								<Image
									className='h-8 w-8 ml-2 align-middle rounded-full bg-center'
									src={avatarURL as string}
									alt='avatar'
									width={40}
									height={40}
								/>
							)}
						</span>
					</label>
					<p className='w-full text-sm text-left px-4 mt-4'>
						Masz konto?
						<Link href='/Login'>
							<button className='text-green-500 font-bold ml-2 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
								Zaloguj się
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
							text={'Zarejestruj'}
							backgroundColor={'bg-blue-500'}
						/>
					</div>
				</form>
			</section>
		);
	} else {
		redirect('/');
	}
};

export default Register;

// vQr1FA5Ps6hYqH0x4XGF
// :
// allUsersUIDs
// :
// (2) ['VHTZJyt0O5bCyijTrxlrAyrqdBj2', 'NrP8bGHk2xZw4viCCwsM4aBB81z1']
// author
// :
// "VHTZJyt0O5bCyijTrxlrAyrqdBj2"
// date
// :
// Timestamp {seconds: 1699197850, nanoseconds: 505000000}
// info
// :
// {uid: 'vQr1FA5Ps6hYqH0x4XGF', displayName: 'Ogólny', photoURL: 'https://firebasestorage.googleapis.com/v0/b/gichat…=media&token=a6a064db-894d-476c-97ba-c9e5b02ddd63'}
// [[Prototype]]
// :
// Object
