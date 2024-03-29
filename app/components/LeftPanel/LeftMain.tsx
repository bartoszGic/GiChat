import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { logoutUserChat } from '@/store/chat-slice';
import { db } from '@/app/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { TransformedUserChat } from '../Types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
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
			const mainChatKey = process.env
				.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY as string;

			const mainChatSnap = await getDoc(doc(db, 'userChats', mainChatKey));
			if (!mainChatSnap.exists() || !mainChatKey) return;
			const membersDoc = mainChatSnap.data()[mainChatKey].info.friendsInRoom;
			const updatedDoc = membersDoc.map(
				(member: { uid: string; isReaded: string }) => ({
					...member,
					isReaded: member.uid === auth.uid ? true : member.isReaded,
				})
			);
			await updateDoc(doc(db, 'userChats', mainChatKey), {
				[`${mainChatKey}.info.friendsInRoom`]: updatedDoc,
			});

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
				chat.displayName === 'Czat ogólny' ? 'bg-cyan-500' : 'bg-neutral-800'
			} flex items-center justify-center w-4/5 py-2 mb-6 rounded-full transition duration-200 hover:bg-cyan-500 active:bg-cyan-500 cursor-pointer`}
			onClick={openMainChat}>
			<span className={`${color} mr-2`}>Czat ogólny</span>
			<FontAwesomeIcon
				className={`${
					chat.displayName === 'Czat ogólny'
						? 'text-neutral-50'
						: 'text-cyan-500'
				} transition duration-200 hover:text-neutral-50`}
				icon={faHouse}
			/>
		</button>
	);
};

export default LeftMain;
