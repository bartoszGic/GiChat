import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { Message, User, UserInRoom } from '../Types/types';
import ForumMsgsSent from './ForumMsgsSent';
import ForumMsgsGroupReceived from './ForumMsgsGroupReceived';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { TransformedUserChat } from '../Types/types';

type ForumMsgsGroupProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
	arrayOfActualDetails: User[];
	userRooms: TransformedUserChat[];
	mainChat: TransformedUserChat[];
};

const ForumMsgsGroup = ({
	setShowImage,
	setImage,
	arrayOfActualDetails,
	userRooms,
	mainChat,
}: ForumMsgsGroupProps) => {
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
	const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([]);
	const lastMessage =
		receivedMessages && receivedMessages.length > 0
			? receivedMessages[receivedMessages.length - 1]
			: null;

	useEffect(() => {
		const allMsgsRef = doc(db, 'allUsersChatMessages', chat.chatKey as string);
		const unsub = onSnapshot(allMsgsRef, doc => {
			doc.exists() && setReceivedMessages(doc.data().messages);
		});
		const watchWhoRead = (mainOrGroup: TransformedUserChat[]) => {
			if (mainOrGroup.length > 0) {
				const room = mainOrGroup.find(user => user.key === chat.chatKey);
				if (!room) return;
				const actualList = room.friendsInRoom.map(userInRoom => {
					const matchingUser = arrayOfActualDetails.find(
						user => user.uid === userInRoom.uid
					);
					if (matchingUser) {
						return {
							...userInRoom,
							displayName: matchingUser.displayName,
							photoURL: matchingUser.photoURL,
						};
					}
					return userInRoom;
				});
				setUsersInRoom(actualList);
			} else return;
		};
		const mainChatKey = process.env
			.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY as string;
		chat.chatKey === mainChatKey
			? watchWhoRead(mainChat)
			: watchWhoRead(userRooms);
		return () => {
			unsub();
		};
	}, [chat.chatKey, auth.uid, userRooms, arrayOfActualDetails, mainChat]);
	return (
		<>
			<ul className='flex flex-col overflow-y-auto h-full w-full px-2 max-w-full'>
				{receivedMessages.length !== 0 &&
					receivedMessages.map((message: Message) => {
						const authorUser = arrayOfActualDetails.find(
							user => user.uid === message.authorID
						);
						const authorActualName = authorUser?.displayName || '';
						const authorActualAvatar = authorUser?.photoURL || null;
						return message.authorID === auth.uid ? (
							<ForumMsgsSent
								key={message.id}
								message={message}
								setShowImage={setShowImage}
								setImage={setImage}
							/>
						) : (
							<ForumMsgsGroupReceived
								key={message.id}
								message={{
									...message,
									displayName: authorActualName,
									photoURL: authorActualAvatar,
								}}
								setShowImage={setShowImage}
								setImage={setImage}
							/>
						);
					})}
				<ul className='flex w-full justify-end items-center mb-2 bg-transparent'>
					{usersInRoom.map(
						(user: UserInRoom) =>
							user.isReaded &&
							receivedMessages.length > 0 &&
							user.uid !== auth.uid &&
							lastMessage?.authorID === auth.uid && (
								<li
									className='flex items-center mr-2'
									key={user.uid}>
									{user.photoURL ? (
										<Image
											className='h-3 w-3 rounded-full'
											src={user.photoURL}
											alt={user.displayName}
											width={30}
											height={30}
										/>
									) : (
										<FontAwesomeIcon
											className='h-3 w-3 align-middle bg-center'
											icon={faUser}
										/>
									)}
								</li>
							)
					)}
				</ul>
			</ul>
		</>
	);
};

export default ForumMsgsGroup;
