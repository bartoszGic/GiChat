import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { Message, User } from '../Types/types';
import ForumMsgsSent from './ForumMsgsSent';
import ForumMsgsReceived from './ForumMsgsGroupReceived';
import ForumMsgsPrivateReceived from './ForumMsgsPrivateReceived';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

type ForumMsgsPrivateProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
	arrayOfActualDetails: User[];
	friendReadMsg: boolean;
};

const ForumMsgsPrivate = ({
	setShowImage,
	setImage,
	arrayOfActualDetails,
	friendReadMsg,
}: ForumMsgsPrivateProps) => {
	// console.log('ForumMsgsPrivate');

	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [receivedMessages, setReceivedMessages] = useState<
		Message[] | undefined | null
	>(null);
	const [actualFriendName, setActualFriendName] = useState('');
	const [actualFriendAvatar, setActualFriendAvatar] = useState<string | null>(
		''
	);
	const lastMessage =
		receivedMessages && receivedMessages.length > 0
			? receivedMessages[receivedMessages.length - 1]
			: null;

	useEffect(() => {
		const allMsgsRef = doc(db, 'allUsersChatMessages', chat.chatKey as string);

		const getRealtimeUpdate = () => {
			const unsub = onSnapshot(allMsgsRef, doc => {
				doc.exists() && setReceivedMessages(doc.data()?.messages);
			});
			return () => {
				unsub();
			};
		};
		getRealtimeUpdate();
	}, [chat.chatKey]);

	useEffect(() => {
		const getActualFriendDetails = async () => {
			const author = arrayOfActualDetails.find(
				user => user.uid === chat.chatID
			);
			setActualFriendName(author?.displayName || '');
			setActualFriendAvatar(author?.photoURL || null);
		};
		getActualFriendDetails();
	}, [chat.chatID, arrayOfActualDetails]);

	return (
		<>
			<ul className='flex flex-col overflow-y-auto h-full w-full px-2 max-w-full'>
				{receivedMessages &&
					receivedMessages.map((message: Message) =>
						message.authorID === auth.uid ? (
							<ForumMsgsSent
								key={message.id}
								message={message}
								setShowImage={setShowImage}
								setImage={setImage}
							/>
						) : (
							<ForumMsgsPrivateReceived
								key={message.id}
								message={message}
								setShowImage={setShowImage}
								setImage={setImage}
								actualFriendName={actualFriendName}
								actualFriendAvatar={actualFriendAvatar}
							/>
						)
					)}
				{lastMessage?.authorID === auth.uid && (
					<li className='flex w-full items-center justify-end mb-2 bg-transparent'>
						{friendReadMsg && actualFriendAvatar && (
							<Image
								className='h-3 w-3 rounded-full'
								src={actualFriendAvatar as string}
								alt='zdjęcie znajomego'
								width={30}
								height={30}
							/>
						)}
						{friendReadMsg && !actualFriendAvatar && (
							<FontAwesomeIcon
								className='h-3 w-3 align-middle bg-center'
								icon={faUser}
							/>
						)}
					</li>
				)}
			</ul>
		</>
	);
};

export default ForumMsgsPrivate;
