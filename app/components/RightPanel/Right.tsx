import Backdrop from '../UI/Backdrop';
import RightAcountBtns from './RightAcountBtns';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowsRotate,
	faXmark,
	faSpinner,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/store';
import Image from 'next/image';
import { auth, db, storage } from '@/app/firebase-config';
import { updateProfile } from 'firebase/auth';
import { useAppDispatch } from '@/store';
import { loadUser } from '@/store/auth-slice';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import {
	deleteObject,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage';

type RightProps = {
	isRightBarOpen: boolean;
	toggleRightBar: () => void;
};

const Right = ({ isRightBarOpen, toggleRightBar }: RightProps) => {
	// console.log('Right');
	const authState = useAppSelector(state => state.auth);
	const [currentName, setCurrentName] = useState(authState.displayName ?? '');
	const [loading, setLoading] = useState(false);
	const [avatar, setAvatar] = useState<File | null>(null);
	const [currentAvatarURL, setCurrentAvatarURL] = useState<string | null>(
		authState.photoURL
	);
	const dispatch = useAppDispatch();
	const authProfile = auth;

	const updateUser = async () => {
		if (!authProfile.currentUser) return;

		const storageRef = ref(
			storage,
			`${authProfile.currentUser.email}_PROFILE_IMG`
		);
		try {
			setLoading(true);
			const defautImg = await fetch('../user.png');
			const blob = await defautImg.blob();
			await deleteObject(storageRef);
			avatar !== null
				? await uploadBytesResumable(storageRef, avatar)
				: await uploadBytesResumable(storageRef, blob);
			const downloadURL = await getDownloadURL(storageRef);
			await updateProfile(authProfile.currentUser, {
				displayName: currentName,
				photoURL: downloadURL,
			});
			const updatedUser = {
				uid: authProfile.currentUser.uid,
				displayName: currentName,
				email: authProfile.currentUser.email,
				photoURL: downloadURL,
			};
			dispatch(loadUser(updatedUser));
			await updateDoc(
				doc(db, 'users', authProfile.currentUser.uid),
				updatedUser
			);
			setCurrentAvatarURL(downloadURL);
			setLoading(false);
			toggleRightBar();
		} catch (error) {
			console.log(error);
		}
	};
	const handleRightAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			setAvatar(file);
			const reader = new FileReader();
			reader.onload = e => {
				if (e.target !== null) setCurrentAvatarURL(e.target.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		const setAvatarFromURL = async (url: string) => {
			try {
				const response = await fetch(url);
				const blob = await response.blob();
				const file = new File([blob], `${authState.email}_PROFILE_IMG`, {
					type: blob.type,
				});
				setAvatar(file);
			} catch (error) {
				console.error(error);
			}
		};
		currentAvatarURL && setAvatarFromURL(currentAvatarURL);
	}, [currentAvatarURL, authState]);

	return (
		<>
			{isRightBarOpen && (
				<Backdrop
					onClick={toggleRightBar}
					isRightBarOpen={isRightBarOpen}
				/>
			)}
			<section
				className={`absolute flex flex-col right-0 w-full h-1/2 bg-slate-500 text-slate-50 ease-in-out duration-200 transition-transform sm:h-1/3 sm:w-2/3 sm:text-lg z-30 ${
					isRightBarOpen ? 'translate-y-0 mt-11' : '-translate-y-full mt-0'
				}`}>
				<div className='flex flex-col py-6 h-full justify-between font-light text-xs sm:text-sm'>
					<div className='flex justify-betweenc pl-4 h-3/4'>
						<div className='flex flex-col items-center justify-around w-3/5 sm:w-2/3'>
							<div className='flex justify-between items-center w-full text-slate-300'>
								<div>Nick:</div>
								<input
									className='bg-slate-400 text-center h-6 w-32 py-1 px-2'
									type='text'
									id='userName'
									onChange={e => setCurrentName(e.target.value)}
									value={currentName}
								/>
							</div>
							<div className='flex justify-between w-full'>
								<div className='text-slate-300'>Email:</div>
								<div>{authState.email}</div>
							</div>
							<div className='flex items-center justify-between w-full'>
								<div className='text-slate-300'>Avatar:</div>
								<div className='flex items-center'>
									{avatar && currentAvatarURL !== authState.photoURL && (
										<button className='mr-1'>
											<FontAwesomeIcon
												className='w-4 h-4 mr-1 text-red-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
												icon={faXmark}
												onClick={() => {
													setCurrentAvatarURL(authState.photoURL);
												}}
											/>
										</button>
									)}
									<label
										className='flex items-center'
										htmlFor='avatar'>
										<input
											onChange={e => handleRightAvatar(e)}
											className='hidden'
											type='file'
											accept='image/*'
											id='avatar'
										/>
										<span className='flex items-center cursor-pointer animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
											{avatar && (
												<Image
													className='h-8 w-8 ml-2 align-middle rounded-full bg-center'
													src={currentAvatarURL as string}
													alt='avatar'
													width={40}
													height={40}
												/>
											)}
										</span>
									</label>
								</div>
							</div>
						</div>
						{!loading ? (
							<button
								className='flex my-auto mx-auto animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
								onClick={updateUser}>
								<FontAwesomeIcon
									className={`w-6 h-6 ${
										currentName !== authState.displayName ||
										currentAvatarURL !== authState.photoURL
											? 'text-red-500'
											: 'text-green-500'
									}`}
									icon={faArrowsRotate}
								/>
							</button>
						) : (
							<button
								className='flex my-auto mx-auto'
								type='submit'>
								<FontAwesomeIcon
									className='w-6 h-6 text-green-500'
									icon={faSpinner}
									spin
								/>
							</button>
						)}
					</div>
					<RightAcountBtns />
				</div>
			</section>
		</>
	);
};

export default Right;
