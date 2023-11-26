import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { onSnapshot, doc, documentId, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { Message } from '../Types/types';
import ForumMsgsSent from './ForumMsgsSent';
import ForumMsgsReceived from './ForumMsgsReceived';

type ForumMsgsProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
};

const ForumMsgs = ({ setShowImage, setImage }: ForumMsgsProps) => {
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [receivedMessages, setReceivedMessages] = useState<
		Message[] | undefined | null
	>(null);
	const [actualFriendName, setActualFriendName] = useState(chat.displayName);

	useEffect(() => {
		const allMsgsRef = doc(db, 'allUsersChatMessages', chat.chatKey as string);

		const getRealtimeUpdate = () => {
			const unsub = onSnapshot(allMsgsRef, doc => {
				doc.exists() && setReceivedMessages(doc.data().messages);
			});
			return () => {
				unsub();
			};
		};
		getRealtimeUpdate();
	}, [chat.chatKey]);

	// useEffect(() => {
	// 	const getActualFriendDetails = async () => {
	// 		const friendRef = doc(db, 'users', chat.chatID as string);
	// 		const actualFriendDetails = await getDoc(friendRef);
	// 		console.log(actualFriendDetails);
	// 	};
	// 	getActualFriendDetails();
	// }, [chat.chatID]);

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
								<ForumMsgsReceived
									key={message.id}
									message={message}
									setShowImage={setShowImage}
									setImage={setImage}
								/>
							)
						)}
				</li>
			</ul>
		</>
	);
};

export default ForumMsgs;
