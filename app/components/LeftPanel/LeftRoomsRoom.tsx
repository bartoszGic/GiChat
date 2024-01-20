import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeUserChat } from '@/store/chat-slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
	collection,
	getDoc,
	doc,
	query,
	where,
	getDocs,
	writeBatch,
	updateDoc,
} from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { UserInRoom } from '../Types/types';
type LeftRoomsRoomProps = {
	chatKey: string;
	id: string;
	photoURL: string;
	displayName: string;
	toggleLeftBar: (bool?: boolean) => void;
	setLoadingForum: React.Dispatch<React.SetStateAction<boolean>>;
	friendsInRoom: UserInRoom[];
	setNumberOfNotifications: React.Dispatch<React.SetStateAction<number>>;
};
const LeftRoomsRoom = ({
	id,
	photoURL,
	displayName,
	chatKey,
	friendsInRoom,
	toggleLeftBar,
	setLoadingForum,
	setNumberOfNotifications,
}: LeftRoomsRoomProps) => {
	// console.log('LeftRoomsRoom');
	const chat = useAppSelector(state => state.chat);
	const auth = useAppSelector(state => state.auth);
	const dispatch = useAppDispatch();
	let color: string;

	const meInRoom = friendsInRoom.find(user => user.uid === auth.uid);
	const isRededByMe = meInRoom?.isReaded;

	if (isRededByMe || (!isRededByMe && chatKey === chat.chatKey)) {
		color = 'text-slate-50';
	} else {
		color = 'text-green-500';
	}

	const openRoomChat = async () => {
		try {
			setLoadingForum(true);
			toggleLeftBar(true);
			if (chatKey && chatKey.slice(0, 6) === 'GROUP_') {
				const userChatsSnap = await getDoc(
					doc(db, 'userChats', auth.uid as string)
				);
				if (!userChatsSnap.exists()) return;
				const members = userChatsSnap.data()[chatKey].info.friendsInRoom;
				const membersUID = members.map((member: { uid: string }) => member.uid);
				const userChatsQuery = query(
					collection(db, 'userChats'),
					where('__name__', 'in', membersUID)
				);
				const membersDocs = await getDocs(userChatsQuery);
				const batch = writeBatch(db);

				membersDocs.docs.forEach(docRef => {
					const updatedMembers = members.map(
						(member: { uid: string; isReaded: string }) => ({
							...member,
							isReaded: member.uid === auth.uid ? true : member.isReaded,
						})
					);
					batch.update(docRef.ref, {
						[`${chatKey}.info.friendsInRoom`]: updatedMembers,
					});
				});
				await batch.commit();
				dispatch(
					changeUserChat({
						chatKey: chatKey,
						chatID: id,
						displayName: displayName,
						photoURL: photoURL,
					})
				);
				color === 'text-green-500' &&
					setNumberOfNotifications(state => state - 1);
				setLoadingForum(false);
			} else {
				return;
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		color === 'text-green-500' && setNumberOfNotifications(state => state + 1);
	}, [color, setNumberOfNotifications]);
	return (
		<li
			key={chatKey}
			className={`flex items-center p-2 overflow-x-hidden ${
				id === chat.chatID ? 'bg-slate-400' : 'bg-transparent'
			}`}>
			<button
				onClick={openRoomChat}
				className='flex items-center overflow-x-hidden animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
				{photoURL ? (
					<Image
						className='h-5 w-5 mr-1 rounded-full'
						src={photoURL as string}
						alt='ikona użytkownika'
						width={40}
						height={40}
					/>
				) : (
					<FontAwesomeIcon
						className='w-6 h-6 rounded-full mr-2 cursor-pointer animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						icon={faUsers}
					/>
				)}
				<span
					className={`
					${color} whitespace-nowrap overflow-x-hidden text-xs`}>
					{displayName}
				</span>
			</button>
		</li>
	);
};

export default LeftRoomsRoom;
