import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
	onSnapshot,
	doc,
	documentId,
	getDoc,
	collection,
	getDocs,
	query,
} from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { Message, User } from '../Types/types';
import ForumMsgsSent from './ForumMsgsSent';
import ForumMsgsReceived from './ForumMsgsMainReceived';
import ForumMsgsPrivateReceived from './ForumMsgsPrivateReceived';

type ForumMsgsPrivateProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
};

const ForumMsgsPrivate = ({
	setShowImage,
	setImage,
}: ForumMsgsPrivateProps) => {
	// console.log('ForumMsgsPrivate');

	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [receivedMessages, setReceivedMessages] = useState<
		Message[] | undefined | null
	>(null);
	const [actualFriendName, setActualFriendName] = useState('');
	const [actualFriendAvatar, setActualFriendAvatar] = useState('');

	useEffect(() => {
		const allMsgsRef = doc(db, 'allUsersChatMessages', chat.chatKey as string);

		const getRealtimeUpdate = () => {
			const unsub = onSnapshot(allMsgsRef, doc => {
				console.log('onSnapshot - allUsersChatMessages - ForumMsgsPrivate');
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
			const friendRef = doc(db, 'users', chat.chatID as string);
			const actualFriendDetails = await getDoc(friendRef);
			setActualFriendName(actualFriendDetails.data()?.displayName);
			setActualFriendAvatar(actualFriendDetails.data()?.photoURL);
		};
		getActualFriendDetails();
	}, [chat.chatID]);

	return (
		<>
			<ul className='flex flex-col items-center overflow-y-auto h-full w-full px-2 max-w-full'>
				<li className='flex flex-col mb-2 w-full text-xs break-words'>
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
				</li>
			</ul>
		</>
	);
};

export default ForumMsgsPrivate;
