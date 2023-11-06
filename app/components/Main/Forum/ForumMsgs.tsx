import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DocumentData } from 'firebase/firestore';
import { useAppSelector } from '@/store';

type ForumMsgs = {
	scrollDown: boolean;
	messages: Message[] | null | undefined;
};
type Message = {
	id: string;
	message: string;
	date: {
		seconds: number;
		nanoseconds: number;
	};
	displayName: string;
	authorID: string;
	img?: string;
};

const ForumMsgs = ({ scrollDown, messages }: ForumMsgs) => {
	const [scroll, setScroll] = useState<number>(0);
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const prevScrollValueRef = useRef<number>(0);

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

	scroll > prevScrollValueRef.current
		? (scrollDown = true)
		: (scrollDown = false);

	useEffect(() => {
		prevScrollValueRef.current = scroll;
	}, [scroll]);
	return (
		<>
			<ul
				className='flex flex-col items-center overflow-y-auto h-full w-full px-2 max-w-full'
				onScroll={e => setScroll(e.currentTarget.scrollTop)}>
				<li className='flex flex-col mb-2 w-full text-xs break-words'>
					{messages &&
						messages.map((message: Message) =>
							message.authorID === auth.uid ? (
								<div
									key={message.id}
									className='flex flex-row-reverse mb-2'>
									<div className='flex flex-col bg-slate-300 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
										<div className='flex text-slate-500 justify-between items-center'>
											<div>{formatDate(message.date.seconds)}</div>
											<div className='text-sm font-bold'>
												{auth.displayName}
											</div>
										</div>
										<div className='mt-2 text-justify'>
											{message.message}
											{message.img && (
												<Image
													src={message.img as string}
													alt='czlowiek'
													width={100}
													height={100}
													priority
												/>
											)}
										</div>
									</div>
								</div>
							) : (
								<div
									key={message.id}
									className='flex mb-2'>
									<div className='flex flex-col bg-slate-300 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
										<div className='flex flex-row-reverse text-slate-500 justify-between items-center'>
											<div>{formatDate(message.date.seconds)}</div>
											<div className='text-sm font-bold'>
												{message.displayName}
											</div>
										</div>
										<div className='mt-2 text-justify'>
											{message.message}
											{message.img && (
												<Image
													src={message.img as string}
													alt='czlowiek'
													width={100}
													height={100}
													priority
												/>
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
