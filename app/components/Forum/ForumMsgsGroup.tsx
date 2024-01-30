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
import ForumMsgsGroupReceived from './ForumMsgsGroupReceived';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type ForumMsgsGroupProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
	arrayOfActualDetails: User[];
};

const ForumMsgsGroup = ({
	setShowImage,
	setImage,
	arrayOfActualDetails,
}: ForumMsgsGroupProps) => {
	// console.log('ForumMsgsMain');
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
	const [arrayOfActualNamesAndAvatars, setArrayOfActualNamesAndAvatars] =
		useState<User[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const allMsgsRef = doc(db, 'allUsersChatMessages', chat.chatKey as string);
		const unsub = onSnapshot(allMsgsRef, doc => {
			doc.exists() && setReceivedMessages(doc.data().messages);
		});
		return () => {
			unsub();
		};
	}, [chat.chatKey]);

	return (
		<>
			<ul className='flex flex-col items-center overflow-y-auto h-full w-full px-2 max-w-full'>
				{loading ? (
					<div className='flex w-full h-full justify-center items-center'>
						<FontAwesomeIcon
							className='w-12 h-12'
							icon={faSpinner}
							spin
						/>
					</div>
				) : (
					<li className='flex flex-col mb-2 w-full text-xs break-words'>
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
					</li>
				)}
			</ul>
		</>
	);
};

export default ForumMsgsGroup;
