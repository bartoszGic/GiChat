import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ForumMsgsMain from './ForumMsgsMain';
import ForumMsgsPrivate from './ForumMsgsPrivate';
import ForumInput from './ForumInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { db } from '@/app/firebase-config';
import { onSnapshot, doc, documentId, getDoc } from 'firebase/firestore';
import { TransformedUserChat } from '../Types/types';

type ForumProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	forumStyleZ: string;
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
	userChats: TransformedUserChat[];
	loadingForum: boolean;
};
const Forum = ({
	isLeftBarOpen,
	toggleLeftBar,
	forumStyleZ,
	setShowImage,
	setImage,
	loadingForum,
}: ForumProps) => {
	// console.log('Forum');
	const chat = useAppSelector(state => state.chat);
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
			className={`absolute flex flex-col w-full bg-slate-400 ease-in-out duration-200 transition-transform ${forumStyleZ} translate-y-11 sm:w-2/3 sm:right-0 h-calc`}>
			{loadingForum ? (
				<div className='flex w-full h-full justify-center items-center'>
					<FontAwesomeIcon
						className='w-12 h-12'
						icon={faSpinner}
						spin
					/>
				</div>
			) : (
				<>
					<div className='flex justify-end items-center py-3 px-4'>
						<div className='h-6 flex'>
							<h3 className='mr-2'>{chat.displayName}</h3>
							{chat.photoURL && (
								<Image
									className='rounded-full'
									src={chat.photoURL as string}
									alt='zdjęcie znajomego'
									width={30}
									height={30}
								/>
							)}
						</div>
					</div>
					{chat.displayName === 'Czat ogólny' ||
					(chat.chatKey !== null &&
						chat.chatKey.substring(0, 6) === 'GROUP_') ? (
						<ForumMsgsMain
							key={chat.chatKey}
							setShowImage={setShowImage}
							setImage={setImage}
						/>
					) : (
						<ForumMsgsPrivate
							key={chat.chatKey}
							setShowImage={setShowImage}
							setImage={setImage}
						/>
					)}

					<ForumInput isLeftBarOpen={isLeftBarOpen} />
				</>
			)}
		</section>
	);
};

export default Forum;
