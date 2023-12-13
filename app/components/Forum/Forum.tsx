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
import { TransformedUserChat, User } from '../Types/types';

type ForumProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	forumStyleZ: string;
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
	userChats: TransformedUserChat[];
	loadingForum: boolean;
	arrayOfActualNames: User[];
};
const Forum = ({
	isLeftBarOpen,
	toggleLeftBar,
	forumStyleZ,
	setShowImage,
	setImage,
	loadingForum,
	userChats,
	arrayOfActualNames,
}: ForumProps) => {
	// console.log('Forum');
	const chat = useAppSelector(state => state.chat);
	const auth = useAppSelector(state => state.auth);
	const listRef = useRef<HTMLDivElement | null>(null);
	const [showList, setShowList] = useState(false);

	useEffect(() => {
		const handleWindowResize = () => {
			window.innerWidth >= 640 ? toggleLeftBar(false) : toggleLeftBar(true);
		};
		window.addEventListener('resize', handleWindowResize);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, [toggleLeftBar]);
	useEffect(() => {
		const outsideClickCatch = (e: MouseEvent) => {
			if (listRef.current) {
				const target = e.target as Node;
				if (!listRef.current.contains(target)) {
					setShowList(false);
				}
			}
		};
		document.addEventListener('mousedown', outsideClickCatch);
		return () => {
			document.removeEventListener('mousedown', outsideClickCatch);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!chat.chatKey) {
		return null;
	}

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
						<div
							className={`flex ${
								chat.chatKey.substring(0, 6) === 'GROUP_'
									? 'justify-between'
									: 'justify-end'
							} h-6 w-full`}>
							{chat.chatKey.substring(0, 6) === 'GROUP_' && (
								<div
									className='flex items-center'
									ref={listRef}>
									<button
										className='flex items-center'
										onClick={() => setShowList(state => !state)}>
										<FontAwesomeIcon
											className='w-6 h-6 rounded-full mr-2 cursor-pointer animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
											icon={faUsers}
										/>
									</button>
									<ul
										className={`${
											showList ? 'flex' : 'hidden'
										} flex-col justify-start absolute left-0 top-0 px-2 py-1 text-xs text-slate-50 w-40 bg-slate-500 max-h-32 max-w-[160px] overflow-y-auto z-30`}>
										{arrayOfActualNames.map(user => (
											<li
												key={user.uid}
												className='flex justify-between items-center py-1 overflow-x-hidden'>
												<div className='flex items-center'>
													<Image
														className='h-6 w-6 mr-2 rounded-full'
														src={user.photoURL}
														alt='zdjęcie znajomego'
														width={20}
														height={20}
													/>
													{user.displayName === auth.displayName ? (
														<div className='ml-2 text-green-500'>TY</div>
													) : (
														<div>{user.displayName}</div>
													)}
												</div>
											</li>
										))}
									</ul>
								</div>
							)}
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
					</div>
					{chat.displayName === 'Czat ogólny' ||
					chat.chatKey.substring(0, 6) === 'GROUP_' ? (
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
