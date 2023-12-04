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
import ForumMsgsMainReceived from './ForumMsgsMainReceived';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type ForumMsgsMainProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
};

const ForumMsgsMain = ({ setShowImage, setImage }: ForumMsgsMainProps) => {
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
	const [arrayOfActualDetails, setArrayOfActualDetails] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const allMsgsRef = doc(db, 'allUsersChatMessages', chat.chatKey as string);
		const unsub = onSnapshot(allMsgsRef, doc => {
			doc.exists() && setReceivedMessages(doc.data().messages);
		});
		return () => {
			unsub();
		};
	}, [chat.chatKey]);

	useEffect(() => {
		const getActualChatDetails = async () => {
			try {
				const userChatsSnap = await getDoc(
					doc(db, 'userChats', chat.chatKey as string)
				);
				if (!userChatsSnap.exists()) return;
				console.log(userChatsSnap.data());
				if (userChatsSnap.exists()) {
					const actualDetails: User[] = [];
					const querySnapshot = await getDocs(query(collection(db, 'users')));

					querySnapshot.forEach(doc => {
						const userData = doc.data() as User;
						actualDetails.push({
							uid: userData.uid,
							displayName: userData.displayName,
							email: userData.email,
							photoURL: userData.photoURL,
						});
					});

					setArrayOfActualDetails(actualDetails);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		getActualChatDetails();
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

								return message.authorID === auth.uid ? (
									<ForumMsgsSent
										key={message.id}
										message={message}
										setShowImage={setShowImage}
										setImage={setImage}
									/>
								) : (
									<ForumMsgsMainReceived
										key={message.id}
										message={{
											...message,
											displayName: authorActualName,
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

export default ForumMsgsMain;
