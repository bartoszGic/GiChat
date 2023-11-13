import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store';
import { onSnapshot, doc, documentId } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { DocumentData } from 'firebase/firestore';
import { Message } from '../Types/types';
import { createLogger } from 'redux-logger';
import { changeUserChat } from '@/store/chat-slice';

type ForumMsgsProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
};

const ForumMsgs = ({ setShowImage, setImage }: ForumMsgsProps) => {
	// console.log('ForumMsgs');
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [receivedMessages, setReceivedMessages] = useState<
		Message[] | undefined | null
	>(null);
	const dispatch = useAppDispatch();
	// const [messages, setMessages] = useState<Message[] | undefined | null>(null);

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp * 1000);
		const currentDate = new Date();
		const currentDay = currentDate.getDate().toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear().toString();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		if (currentDay > day) {
			return `${day}.${month}.${year} ${hours}:${minutes} `;
		} else {
			return `dzisiaj ${hours}:${minutes}`;
		}
	};

	useEffect(() => {
		const docRef = doc(db, 'allUsersChatMessages', chat.chatKey as string);
		const getRealtimeUpdate = () => {
			const unsub = onSnapshot(docRef, doc => {
				doc.exists() && setReceivedMessages(doc.data().messages);
			});
			console.log(chat.chatKey);
			return () => {
				unsub();
			};
		};
		getRealtimeUpdate();
		console.log(chat.chatKey);
	}, [chat.chatKey]);

	return (
		<>
			<div className='flex justify-end items-center py-3 px-4'>
				<h3 className='mr-2'>{chat.chatKey}</h3>
				<Image
					className='rounded-full'
					src={chat.photoURL as string}
					alt='zdjęcie znajomego'
					width={30}
					height={30}
				/>
			</div>
			<ul className='flex flex-col items-center overflow-y-auto h-full w-full px-2 max-w-full'>
				<li className='flex flex-col mb-2 w-full text-xs break-words'>
					{receivedMessages &&
						receivedMessages.map((message: Message) =>
							message.authorID === auth.uid ? (
								<div
									key={message.id}
									className='flex flex-row-reverse mb-2'>
									<div className='flex flex-col bg-slate-300 text-slate-950 px-2 py-2 w-3/4 rounded-t-lg rounded-bl-lg sm:max-w-[350px]'>
										<div className='flex text-slate-500 justify-between items-center'>
											<div>{formatDate(message.date.seconds)}</div>
											<div className='text-sm font-bold'>
												{auth.displayName}
											</div>
										</div>
										<div className='mt-2 text-justify'>{message.message}</div>
										{message.img && (
											<div
												className='flex flex-col cursor-pointer mt-2'
												onClick={() => {
													setShowImage(true);
													setImage(message.img as string);
												}}>
												<Image
													src={message.img as string}
													alt='przesłany obraz'
													width={160}
													height={160}
												/>
											</div>
										)}
									</div>
								</div>
							) : (
								<div
									key={message.id}
									className='flex mb-2'>
									<div className='flex flex-col bg-slate-50 text-slate-950 px-2 py-2 w-3/4 rounded-t-lg rounded-br-lg sm:max-w-[350px]'>
										<div className='flex flex-row-reverse text-slate-500 justify-between items-center'>
											<div>{formatDate(message.date.seconds)}</div>
											<div className='text-sm font-bold'>
												{message.displayName}
											</div>
										</div>
										<div className='mt-2 text-justify'>{message.message}</div>
										<div className='relative mt-2 text-justify w-40'>
											{message.img && (
												<div
													className='flex flex-col cursor-pointer mt-2'
													onClick={() => {
														setShowImage(true);
														setImage(message.img as string);
													}}>
													<Image
														src={message.img as string}
														alt='przesłany obraz'
														width={160}
														height={160}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
							)
						)}
				</li>
			</ul>
		</>
	);
};

export default ForumMsgs;
