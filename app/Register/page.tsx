'use client';
import Button from '../components/UI/Button';
import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faUser,
	faUsers,
	faXmark,
	faSpinner,
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
	// console.log('Register');
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
					isReaded: false,
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
				<h2 className='flex items-center justify-center h-6 text-xl lett tracking-wide'>
					{!loading ? (
						<span>Rejestracja</span>
					) : (
						<FontAwesomeIcon
							className='w-6 h-6 py-1 text-slate-50'
							icon={faSpinner}
							spin
						/>
					)}
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
