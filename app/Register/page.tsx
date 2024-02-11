'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faUser,
	faXmark,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc, doc, arrayUnion, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadUser } from '@/store/auth-slice';
import { useRouter, redirect } from 'next/navigation';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [avatar, setAvatar] = useState<File | null>(null);
	const [avatarURL, setAvatarURL] = useState<string | null>(null);
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
			avatar !== null
				? await uploadBytesResumable(storageRef, avatar)
				: await uploadBytesResumable(storageRef, blob);

			const onStorageURL = await getDownloadURL(storageRef);
			let onFirestoreURL;
			avatar !== null
				? (onFirestoreURL = onStorageURL)
				: (onFirestoreURL = null);
			await updateProfile(profile.user, {
				displayName: email,
				photoURL: onStorageURL,
			});
			const userData = {
				uid: profile.user.uid,
				displayName: email,
				email: email,
				photoURL: onFirestoreURL,
			};
			dispatch(loadUser(userData));
			await setDoc(doc(db, 'users', profile.user.uid), userData);

			await setDoc(doc(db, 'userChats', profile.user.uid), {});

			await updateDoc(doc(db, 'userChats', chat.chatKey as string), {
				[`${chat.chatKey}.info.friendsInRoom`]: arrayUnion({
					displayName: email,
					email: email,
					uid: profile.user.uid,
					photoURL: onFirestoreURL,
					isReaded: false,
				}),
			});
			router.push('/');
		} catch (error) {
			console.log(error);
		}
	};

	const signUpHandler = async () => {
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
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			signUpHandler();
		}
	};
	useEffect(() => {
		isAuth !== null ? setLogged(true) : setLogged(false);
	}, [isAuth]);

	if (logged === null) {
		return null;
	} else if (!logged) {
		return (
			<section className='flex flex-col items-center mt-8'>
				<h2 className='flex items-center justify-center h-6 text-xl'>
					{!loading ? (
						<span className='tracking-widest'>Rejestracja</span>
					) : (
						<FontAwesomeIcon
							className='w-6 h-6 py-1 text-neutral-50'
							icon={faSpinner}
							spin
						/>
					)}
				</h2>
				<div className='flex flex-col items-center mt-4'>
					<input
						className='py-3 px-4 m-4 text-neutral-700 rounded-full'
						type='text'
						id='username'
						name='username'
						placeholder='Email:'
						onChange={e => setEmail(e.target.value)}
						onKeyDown={handleKeyDown}
						value={email}
					/>
					<div className='pb-4 px-4 text-red-500 w-full text-xs sm:text-sm'>
						{emailError}
					</div>
					<input
						className='py-3 px-4 m-4 text-neutral-700 rounded-full'
						type='password'
						id='password'
						name='password'
						placeholder='Hasło:'
						onChange={e => setPassword1(e.target.value)}
						onKeyDown={handleKeyDown}
						value={password1}
					/>
					<div className='pb-4 px-4 text-red-500 w-full text-xs sm:text-sm'>
						{passwordError}
					</div>
					<input
						className='py-3 px-4 m-4 text-gray-700 rounded-full'
						type='password'
						id='passwordConfirm'
						name='passwordConfirm'
						placeholder='Powtórz hasło:'
						onChange={e => setPassword2(e.target.value)}
						onKeyDown={handleKeyDown}
						value={password2}
					/>
					<div className='px-4 text-red-500 w-full text-xs sm:text-sm'>
						{passwordError}
					</div>
					<div className='flex items-center w-full p-4'>
						<label
							className='flex items-center'
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
								{!avatarURL ? (
									<FontAwesomeIcon
										className='h-6 w-6 m-1 align-middle bg-center'
										icon={faUser}
									/>
								) : (
									<Image
										className='h-8 w-8 ml-2 align-middle rounded-full bg-center'
										src={avatarURL}
										alt='avatar'
										width={40}
										height={40}
									/>
								)}
							</span>
						</label>
						{avatarURL && (
							<button
								type='button'
								className='ml-3'>
								<FontAwesomeIcon
									className='w-5 h-5 text-red-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
									icon={faXmark}
									onClick={() => {
										setAvatar(null);
										setAvatarURL(null);
									}}
								/>
							</button>
						)}
					</div>
					<div className='flex w-full px-4 mt-4 text-sm'>
						<div className='flex flex-col justify-between w-full text-left'>
							<span className='mb-8'>Masz konto?</span>
							<Link
								className='flex h-full items-center w-8 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
								href='/'>
								<FontAwesomeIcon
									className='h-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
									icon={faArrowLeft}
								/>
							</Link>
						</div>
						<div className='flex flex-col justify-between items-center w-full'>
							<Link
								className='mb-8 text-cyan-500 font-bold animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn tracking-wider'
								href='/Login'>
								Zaloguj się
							</Link>
							<button className='bg-cyan-500 px-8 py-2 relative group rounded-full font-medium text-neutral-50 inline-block'>
								<span
									onClick={signUpHandler}
									className={`absolute rounded-full top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-neutral-950 group-hover:h-full group-hover:scale-105`}></span>
								<span className='relative text-lg'>Zarejestruj</span>
							</button>
						</div>
					</div>
				</div>
			</section>
		);
	} else {
		redirect('/');
	}
};

export default Register;
