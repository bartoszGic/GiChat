import React, { useState, useEffect } from 'react';
import Backdrop from '../UI/Backdrop';
import LeftFriend from './LeftFriend';
import LeftRooms from './LeftRooms';
import {
	doc,
	onSnapshot,
	getDocs,
	query,
	collection,
} from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateDisplayNameAndPhotoURL } from '@/store/chat-slice';
import Image from 'next/image';
import { UserChat, TransformedUserChat, User } from '../Types/types';
import LeftMain from './LeftMain';

type LeftProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	setUserChats: React.Dispatch<React.SetStateAction<TransformedUserChat[]>>;
	userChats: TransformedUserChat[];
	setLoadingForum: React.Dispatch<React.SetStateAction<boolean>>;
	setArrayOfActualNames: React.Dispatch<React.SetStateAction<User[]>>;
	arrayOfActualNames: User[];
};

const Left = ({
	isLeftBarOpen,
	toggleLeftBar,
	setUserChats,
	userChats,
	setLoadingForum,
	setArrayOfActualNames,
	arrayOfActualNames,
}: LeftProps) => {
	// console.log('Left');

	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [innerWidth, setInnerWidth] = useState(0);
	const [userRooms, setUserRoms] = useState<TransformedUserChat[]>([]);

	// useEffect(() => {
	// 	const getActualNames = async () => {
	// 		try {
	// 			const actualDetails: User[] = [];
	// 			const querySnapshot = await getDocs(query(collection(db, 'users')));

	// 			querySnapshot.forEach(doc => {
	// 				const userData = doc.data() as User;
	// 				actualDetails.push({
	// 					uid: userData.uid,
	// 					displayName: userData.displayName,
	// 					email: userData.email,
	// 					photoURL: userData.photoURL,
	// 				});
	// 			});
	// 			setArrayOfActualNames(actualDetails);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	};
	// 	getActualNames();
	// }, [setArrayOfActualNames, , chat.chatKey]);
	useEffect(() => {
		const unsub1 = onSnapshot(collection(db, 'users'), doc => {
			const actualDetails: User[] = [];
			doc.forEach(doc => {
				const userData = doc.data() as User;
				actualDetails.push({
					uid: userData.uid,
					displayName: userData.displayName,
					email: userData.email,
					photoURL: userData.photoURL,
				});
			});
			setArrayOfActualNames(actualDetails);
		});
		return () => {
			unsub1();
		};
	}, [setArrayOfActualNames]);

	useEffect(() => {
		if (!auth.uid) return;
		const unsub2 = onSnapshot(doc(db, 'userChats', auth.uid), doc => {
			console.log('onSnapshot - userChats - Left');

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
						author: data[key]?.author || '',
						isReaded: data[key]?.isReaded || true,
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
				<div className='flex flex-col h-full w-full justify-between items-center'>
					<div className='flex w-full py-4'>
						<div className='flex flex-col w-1/2'>
							<h3 className='mb-4 ml-2'>Znajomi</h3>
							<ul className='flex flex-col'>
								{userChats !== undefined &&
									userChats.map(chat => {
										const friendName = arrayOfActualNames.find(
											user => user.uid === chat.uid
										);
										const friendAvatar = arrayOfActualNames.find(
											user => user.uid === chat.uid
										);
										const friendActualName = friendName?.displayName || '';
										const friendActualAvatar = friendAvatar?.photoURL || '';
										return (
											<LeftFriend
												chatKey={chat.key}
												key={chat.uid}
												id={chat.uid}
												isReaded={chat.isReaded}
												photoURL={friendActualAvatar}
												displayName={friendActualName}
												setLoadingForum={setLoadingForum}
											/>
										);
									})}
							</ul>
						</div>
						<div className='flex flex-col w-1/2'>
							<LeftRooms
								userChats={userChats}
								userRooms={userRooms}
							/>
						</div>
					</div>
					<LeftMain />
				</div>
			</section>
		</>
	);
};

export default Left;
