import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ForumMsgsGroup from './ForumMsgsGroup';
import ForumMsgsPrivate from './ForumMsgsPrivate';
import ForumInput from './ForumInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUsers,
	faSpinner,
	faUser,
	faHome,
} from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { db } from '@/app/firebase-config';
import { onSnapshot, doc, documentId, getDoc } from 'firebase/firestore';
import { TransformedUserChat, User } from '../Types/types';
import ForumMembers from './ForumMembers';

type ForumProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	forumStyleZ: string;
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
	userChats: TransformedUserChat[];
	loadingForum: boolean;
	arrayOfActualDetails: User[];
};
const Forum = ({
	isLeftBarOpen,
	toggleLeftBar,
	forumStyleZ,
	setShowImage,
	setImage,
	loadingForum,
	userChats,
	arrayOfActualDetails,
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

	if (!chat.chatKey) {
		return null;
	}

	return (
		<section
			className={`absolute flex flex-col w-full bg-neutral-950 ease-in-out duration-200 transition-transform ${forumStyleZ} translate-y-[56px] sm:w-2/3 sm:right-0 h-calc`}>
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
					<div className='flex items-center py-3 px-4'>
						<div
							className={`flex ${
								chat.chatKey.substring(0, 6) === 'GROUP_'
									? 'w-calc justify-between'
									: 'w-full justify-center sm:justify-end'
							} items-center`}>
							{chat.chatKey.substring(0, 6) === 'GROUP_' && (
								<ForumMembers arrayOfActualNames={arrayOfActualDetails} />
							)}
							<div className='flex items-center'>
								<h3 className='mr-2'>{chat.displayName}</h3>
								{chat.photoURL ? (
									chat.displayName !== 'Czat ogólny' ? (
										<Image
											className='h-6 w-6 rounded-full'
											src={chat.photoURL as string}
											alt='zdjęcie znajomego'
											width={30}
											height={30}
										/>
									) : (
										<FontAwesomeIcon
											className='h-6 w-6 text-cyan-500'
											icon={faHome}
										/>
									)
								) : chat.chatKey.substring(0, 6) === 'GROUP_' ? (
									<FontAwesomeIcon
										className='h-7 w-7 align-middle bg-center'
										icon={faUsers}
									/>
								) : (
									<FontAwesomeIcon
										className='h-6 w-6 align-middle bg-center'
										icon={faUser}
									/>
								)}
							</div>
						</div>
					</div>
					{chat.displayName === 'Czat ogólny' ||
					chat.chatKey.substring(0, 6) === 'GROUP_' ? (
						<ForumMsgsGroup
							key={chat.chatKey}
							setShowImage={setShowImage}
							setImage={setImage}
							arrayOfActualDetails={arrayOfActualDetails}
						/>
					) : (
						<ForumMsgsPrivate
							key={chat.chatKey}
							setShowImage={setShowImage}
							setImage={setImage}
							arrayOfActualDetails={arrayOfActualDetails}
						/>
					)}

					<ForumInput isLeftBarOpen={isLeftBarOpen} />
				</>
			)}
		</section>
	);
};

export default Forum;
