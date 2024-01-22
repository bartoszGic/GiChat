import { TransformedUserChat, User } from '../Types/types';
import React, { useEffect, useRef, useState } from 'react';
import LeftRoomAddList from './LeftRoomAddList';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import {
	getDoc,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { useAppSelector } from '@/store';

type LeftRoomsAddProps = {
	userChats: TransformedUserChat[] | undefined;
	showList: boolean;
	roomUsers: TransformedUserChat[];
	setShowList: React.Dispatch<React.SetStateAction<boolean>>;
	setRoomUsers: React.Dispatch<React.SetStateAction<TransformedUserChat[]>>;
	usersListRef: React.RefObject<HTMLDivElement>;
	image: File | null;
	setImage: React.Dispatch<React.SetStateAction<File | null>>;
	imageURL: string | null;
	setImageURL: React.Dispatch<React.SetStateAction<string | null>>;
};
const LeftRoomsAdd = ({
	userChats,
	showList,
	roomUsers,
	setShowList,
	setRoomUsers,
	usersListRef,
	image,
	setImage,
	imageURL,
	setImageURL,
}: LeftRoomsAddProps) => {
	const [roomName, setRoomName] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const auth = useAppSelector(state => state.auth);

	const addRoomHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (auth.uid === null) return;
		if (roomName.trim() === '') {
			setErrorMsg('Podaj nazwe grupy');
			return;
		}
		if (roomUsers.length < 2) {
			setErrorMsg('Wybierz przynajmniej 2 użytkowników');
			return;
		}
		try {
			const sortedIds = roomUsers.map(user => user.uid.substring(0, 3)).sort();
			const combinedId = `GROUP_${sortedIds.join('')}`;
			const roomCreator = {
				uid: auth.uid,
				displayName: auth.displayName || '',
				photoURL: auth.photoURL || '',
				isReaded: true,
			};
			const docSnap = await getDoc(doc(db, 'allUsersChatMessages', combinedId));
			if (!docSnap.exists()) {
				await setDoc(doc(db, 'allUsersChatMessages', combinedId), {
					members: [...roomUsers, roomCreator],
					messages: [],
				});
				const roomInfo = {
					friendsInRoom: roomUsers.map(user => ({
						uid: user.uid,
						displayName: user.displayName,
						photoURL: user.photoURL,
						isReaded: true,
					})),
					displayName: roomName,
					photoURL: imageURL,
					uid: combinedId,
				};
				roomInfo.friendsInRoom.push(roomCreator);

				await updateDoc(doc(db, 'userChats', auth.uid), {
					[`${combinedId}.info`]: roomInfo,
					[`${combinedId}.date`]: serverTimestamp(),
					[`${combinedId}.author`]: '',
				});
				for (const user of roomUsers) {
					await updateDoc(doc(db, 'userChats', user.uid), {
						[`${combinedId}.info`]: roomInfo,
						[`${combinedId}.date`]: serverTimestamp(),
						[`${combinedId}.author`]: '',
					});
				}
			}
			setShowList(false);
			setRoomName('');
			setErrorMsg('');
		} catch (error: any) {
			console.log(error);
		}
	};
	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const file = e.target.files && e.target.files[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onload = e => {
				if (e.target !== null) setImageURL(e.target.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	const toggleUser = (friend: TransformedUserChat) => {
		if (!roomUsers.some(user => user.uid === friend.uid)) {
			setRoomUsers(prevUsers => [...prevUsers, friend]);
		} else {
			setRoomUsers(prevUsers =>
				prevUsers.filter(user => user.uid !== friend.uid)
			);
		}
	};

	return (
		<form
			className='relative mb-4 ml-2'
			onSubmit={addRoomHandler}>
			<div
				ref={usersListRef}
				className={`${
					showList ? 'flex flex-col justify-between' : 'hidden'
				} absolute rounded-xl -left-[124px] -top-10 p-4 text-xs text-neutral-50 w-64 h-[500px] bg-neutral-800 z-30 sm:text-sm sm:w-72 sm:p-4`}>
				<input
					type='text'
					className='px-2 py-4 mb-4 h-6 rounded-xl text-base text-neutral-950 items-center text-center bg-neutral-50 placeholder-neutral-500 sm:text-sm'
					id='search'
					placeholder='Wpisz nazwe pokoju...'
					onChange={e => setRoomName(e.target.value)}
					value={roomName}
				/>
				<ul className='flex flex-col items-stretch rounded-md py-2 px-1 h-64 overflow-auto bg-neutral-800'>
					{userChats !== undefined ? (
						userChats.map(user => (
							<LeftRoomAddList
								key={user.uid}
								user={user}
								roomUsers={roomUsers}
								toggleUser={toggleUser}
							/>
						))
					) : (
						<li className='flex w-full justify-between items-center py-1 '>
							Nie znaleziono użytkowników
						</li>
					)}
				</ul>
				<div className='flex flex-col mt-6'>
					<div className='flex justify-center w-full'>
						{imageURL && (
							<button>
								<FontAwesomeIcon
									className='w-4 h-4 mr-1 text-red-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
									icon={faXmark}
									onClick={() => {
										setImage(null);
										setImageURL(null);
									}}
								/>
							</button>
						)}
						<input
							className='hidden'
							type='file'
							accept='image/*'
							id='image'
							onChange={handleImage}
						/>
						<label
							htmlFor='image'
							className='flex items-center'>
							{imageURL ? (
								<Image
									className='h-8 w-8 cursor-pointer rounded-full mr-2'
									src={imageURL}
									alt='avatar'
									width={40}
									height={40}
								/>
							) : (
								<FontAwesomeIcon
									className='w-8 h-8 rounded-full mr-2 cursor-pointer animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
									icon={faUsers}
								/>
							)}
							<span>Ikona grupy</span>
						</label>
					</div>
					<div className='my-2 text-center text-red-500'>{errorMsg}</div>
					<button
						type='submit'
						className='cursor-pointer rounded-full text-base left-0 top-7 flex items-center justify-center bg-cyan-500 mt-2 px-2 py-1 z-30 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
						Stwórz pokój
					</button>
				</div>
			</div>
		</form>
	);
};

export default LeftRoomsAdd;
