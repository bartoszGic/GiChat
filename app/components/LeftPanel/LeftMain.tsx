import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { logoutUserChat } from '@/store/chat-slice';
import Image from 'next/image';
import { db } from '@/app/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const LeftMain = () => {
	// console.log('LeftMain');
	const chat = useAppSelector(state => state.chat);
	const auth = useAppSelector(state => state.auth);

	const [color, setColor] = useState('');
	const dispatch = useAppDispatch();
	const openMainChat = async () => {
		try {
			// setLoadingForum(true);
			// toggleLeftBar(true);

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
			console.log(mainChatSnap.data());
			const membersDoc =
				mainChatSnap.data()[process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY]
					.info.friendsInRoom;
			const updatedDoc = membersDoc.map(
				(member: { uid: string; isReaded: string }) => ({
					...member,
					isReaded: member.uid === auth.uid ? true : member.isReaded,
				})
			);
			console.log(updatedDoc);
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
			// setLoadingForum(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<button
			className={`${
				chat.displayName === 'Czat ogólny' ? 'bg-slate-400' : 'bg-transparent'
			} flex items-center justify-center w-4/5 py-2 mb-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn`}
			onClick={openMainChat}>
			<span className='mr-2'>Czat ogólny</span>
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
