import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ForumMsgs from './ForumMsgs';
import ForumInput from './ForumInput';
import { useAppSelector } from '@/store';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { DocumentData } from 'firebase/firestore';
type ForumProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	forumStyleZ: string;
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
const Forum = ({ isLeftBarOpen, toggleLeftBar, forumStyleZ }: ForumProps) => {
	const chat = useAppSelector(state => state.chat);
	const [messages, setMessages] = useState<Message[] | undefined | null>(null);
	let scrollDown: boolean = false;

	useEffect(() => {
		const getRealtimeUpdate = () => {
			const unsub = onSnapshot(
				doc(db, 'allUsersChatMessages', chat.chatKey as string),
				doc => {
					doc.exists() && setMessages(doc.data().messages);
				}
			);
			return () => {
				unsub();
			};
		};
		chat.chatKey && getRealtimeUpdate();
	}, [chat.chatKey]);

	useEffect(() => {
		const handleWindowResize = () => {
			window.innerWidth >= 640 ? toggleLeftBar(false) : toggleLeftBar(true);
		};
		window.addEventListener('resize', handleWindowResize);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, [toggleLeftBar]);

	return (
		<section
			className={`absolute flex flex-col w-full bg-slate-400 ease-in-out duration-200 transition-transform ${forumStyleZ} sm:w-2/3 sm:right-0 sm:h-calc ${
				scrollDown && !isLeftBarOpen
					? 'translate-y-0 sm:translate-y-11'
					: 'translate-y-11'
			} ${isLeftBarOpen ? 'translate-y-0 h-calc' : 'h-full'}`}>
			<div className='flex justify-end items-center py-3 px-4'>
				<h3 className='mr-2'>{chat.displayName}</h3>
				<Image
					className='rounded-full'
					src={chat.photoURL as string}
					alt='zdjęcie znajomego'
					width={30}
					height={30}
				/>
			</div>
			<ForumMsgs
				messages={messages}
				scrollDown={scrollDown}
			/>
			<ForumInput isLeftBarOpen={isLeftBarOpen} />
		</section>
	);
};

export default Forum;
