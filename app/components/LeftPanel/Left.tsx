import React, { useState, useEffect } from 'react';
import Backdrop from '../UI/Backdrop';
import LeftFriend from './LeftFriend';
import LeftRooms from './LeftRooms';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateDisplayNameAndPhotoURL } from '@/store/chat-slice';
import Image from 'next/image';
import { logoutUserChat } from '@/store/chat-slice';
import { UserChat, TransformedUserChat, User } from '../Types/types';

type LeftProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	setUserChats: React.Dispatch<React.SetStateAction<TransformedUserChat[]>>;
	userChats: TransformedUserChat[];
	setLoadingForum: React.Dispatch<React.SetStateAction<boolean>>;
};

const Left = ({
	isLeftBarOpen,
	toggleLeftBar,
	setUserChats,
	userChats,
	setLoadingForum,
}: LeftProps) => {
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [innerWidth, setInnerWidth] = useState(0);
	const [userRooms, setUserRoms] = useState<TransformedUserChat[]>([]);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!chat.chatID || typeof chat.chatID !== 'string') return;
		const unsub1 = onSnapshot(doc(db, 'users', chat.chatID), doc => {
			setLoadingForum(true);
			const actualFriendDetails = doc.data() as User;
			if (
				chat.displayName === 'Czat ogólny' ||
				(chat.chatKey && chat.chatKey.substring(0, 6) === 'GROUP_')
			) {
				setLoadingForum(false);
			} else {
				dispatch(
					updateDisplayNameAndPhotoURL({
						displayName: actualFriendDetails.displayName,
						photoURL: actualFriendDetails.photoURL,
					})
				);
				setLoadingForum(false);
			}
		});

		return () => {
			unsub1();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chat, dispatch]);

	useEffect(() => {
		if (!auth.uid) return;
		const unsub2 = onSnapshot(doc(db, 'userChats', auth.uid), doc => {
			const data = doc.data() as UserChat;
			if (!data) return;
			const transformedChatsData = Object.keys(data).map(key => {
				// Poniżej dodatkowe zabezpieczenia if, filter,? i z powodu błedu wystęującym tylko przy dodawniu nowego znajomego w NavSearch
				if (data[key]?.date) {
					return {
						key: key,
						date: data[key].date?.seconds || 0,
						displayName: data[key].info?.displayName || '',
						photoURL: data[key].info?.photoURL || '',
						uid: data[key].info?.uid || '',
						author: data[key].author || '',
					};
				}
				return null;
			});
			const rooms: TransformedUserChat[] = [];
			const chats: TransformedUserChat[] = [];
			transformedChatsData.forEach(item => {
				if (item === null) return;
				if (item.key.slice(0, 6) === 'GROUP_') {
					rooms.push(item);
				} else {
					chats.push(item);
				}
			});
			setUserRoms(rooms);
			setUserChats(chats);
		});
		return () => {
			unsub2();
		};
	}, [auth.uid, setUserChats, setUserRoms, setLoadingForum]);

	useEffect(() => {
		const updateInnerWidth = () => {
			setInnerWidth(window.innerWidth);
		};
		updateInnerWidth();
		window.addEventListener('resize', updateInnerWidth);
		return () => {
			window.removeEventListener('resize', updateInnerWidth);
		};
	}, [setInnerWidth]);

	return (
		<>
			{isLeftBarOpen && (
				<Backdrop
					onClick={toggleLeftBar}
					bool={isLeftBarOpen}
				/>
			)}
			<section
				className={`absolute h-calc mt-11 bg-slate-500 ease-in-out duration-200 transition-transform z-40  ${
					isLeftBarOpen || innerWidth >= 640
						? 'transform translate-x-0 w-3/4 sm:w-1/3'
						: 'transform -translate-x-full w-2/3 sm:w-1/3'
				}`}>
				<div className='flex flex-col h-full justify-between'>
					<div className='grid grid-cols-2 px-2 py-4 gap-4'>
						<div>
							<h3 className='mb-4'>Znajomi</h3>
							<ul className='grid gap-2'>
								{userChats !== undefined &&
									userChats.map(chat => (
										<LeftFriend
											chatKey={chat.key}
											key={chat.uid}
											id={chat.uid}
											photoURL={chat.photoURL}
											displayName={chat.displayName}
										/>
									))}
							</ul>
						</div>
						<div>
							<LeftRooms
								userChats={userChats}
								userRooms={userRooms}
							/>
						</div>
					</div>
					<button
						className='flex items-center w-full justify-center mb-4 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						onClick={() => dispatch(logoutUserChat())}>
						<span className='mr-2'>Czat ogólny</span>
						<Image
							src='/home (1).png'
							alt='czat ogólny'
							width={20}
							height={20}
						/>
					</button>
				</div>
			</section>
		</>
	);
};

export default Left;
