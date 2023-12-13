import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store';
import {
	changeUserChat,
	updateDisplayNameAndPhotoURL,
} from '@/store/chat-slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { User } from '../Types/types';

type LeftFriendProps = {
	chatKey: string;
	id: string;
	photoURL: string | null;
	displayName: string;
	setLoadingForum: React.Dispatch<React.SetStateAction<boolean>>;
	isReaded: boolean;
};
const LeftFriend = ({
	id,
	photoURL,
	displayName,
	chatKey,
	setLoadingForum,
	isReaded,
}: LeftFriendProps) => {
	// console.log('LeftFriend');
	const chat = useAppSelector(state => state.chat);
	const auth = useAppSelector(state => state.auth);

	const dispatch = useAppDispatch();
	console.log(isReaded);
	const openFriendChat = async () => {
		try {
			setLoadingForum(true);
			const userSnapshot = await getDoc(doc(db, 'users', id));
			const userChatsSnapshot = await getDoc(
				doc(db, 'userChats', auth.uid as string)
			);
			await updateDoc(doc(db, 'userChats', auth.uid as string), {
				[`${chat.chatKey}.isReaded`]: true,
			});
			const userData = userSnapshot.data() as User;

			dispatch(
				updateDisplayNameAndPhotoURL({
					displayName: userData.displayName,
					photoURL: userData.photoURL,
				})
			);

			dispatch(
				changeUserChat({
					chatKey: chatKey,
					chatID: id,
					displayName: userData.displayName,
					photoURL: userData.photoURL,
				})
			);
			setLoadingForum(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<li
			className={`flex items-center p-2 overflow-x-hidden ${
				id === chat.chatID ? 'bg-slate-400' : 'bg-transparent'
			}`}>
			<button
				className='flex items-center overflow-x-hidden animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
				onClick={openFriendChat}>
				<Image
					className='h-5 w-5 mr-1 rounded-full'
					src={photoURL as string}
					alt='ikona użytkownika'
					width={40}
					height={40}
				/>
				<span
					className={`${
						isReaded ? 'text-slate-50' : 'text-green-500'
					} whitespace-nowrap overflow-x-hidden text-xs`}>
					{displayName}
				</span>
			</button>
		</li>
	);
};

export default LeftFriend;
