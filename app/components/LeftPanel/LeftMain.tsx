import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { logoutUserChat } from '@/store/chat-slice';
import Image from 'next/image';
import { db } from '@/app/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { TransformedUserChat } from '../Types/types';
type LeftMainProps = {
	toggleLeftBar: (bool?: boolean) => void;
	setLoadingForum: React.Dispatch<React.SetStateAction<boolean>>;
	setNumberOfNotifications: React.Dispatch<React.SetStateAction<number>>;
	mainChat: TransformedUserChat[];
};
const LeftMain = ({
	toggleLeftBar,
	setLoadingForum,
	setNumberOfNotifications,
	mainChat,
}: LeftMainProps) => {
	// console.log('LeftMain');
	const chat = useAppSelector(state => state.chat);
	const auth = useAppSelector(state => state.auth);
	let color: string;

	const dispatch = useAppDispatch();
	if (mainChat && mainChat.length > 0) {
		const meInRoom = mainChat[0].friendsInRoom.find(
			user => user.uid === auth.uid
		);
		const isRededByMe = meInRoom?.isReaded;
		if (isRededByMe || (!isRededByMe && mainChat[0].key === chat.chatKey)) {
			color = 'text-slate-50';
		} else {
			color = 'text-green-500';
		}
	} else {
		color = 'text-slate-50';
	}

	const openMainChat = async () => {
		try {
			setLoadingForum(true);
			toggleLeftBar(true);
			const mainChatSnap = await getDoc(
				doc(
					db,
					'userChats',
					process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY as string
				)
			);
			if (
				!mainChatSnap.exists() ||
				!process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY
			)
				return;
			const membersDoc =
				mainChatSnap.data()[process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY]
					.info.friendsInRoom;
			const updatedDoc = membersDoc.map(
				(member: { uid: string; isReaded: string }) => ({
					...member,
					isReaded: member.uid === auth.uid ? true : member.isReaded,
				})
			);
			await updateDoc(
				doc(
					db,
					'userChats',
					process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY as string
				),
				{
					[`${process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY}.info.friendsInRoom`]:
						updatedDoc,
				}
			);

			dispatch(logoutUserChat());
			color === 'text-green-500' &&
				setNumberOfNotifications(state => state - 1);
			setLoadingForum(false);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		color === 'text-green-500' && setNumberOfNotifications(state => state + 1);
	}, [color, setNumberOfNotifications]);
	return (
		<button
			className={`${
				chat.displayName === 'Czat ogólny' ? 'bg-slate-400' : 'bg-transparent'
			} flex items-center justify-center w-4/5 py-2 mb-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn`}
			onClick={openMainChat}>
			<span className={`${color} mr-2`}>Czat ogólny</span>
			<Image
				src='/home (1).png'
				alt='czat ogólny'
				width={20}
				height={20}
			/>
		</button>
	);
};

export default LeftMain;
