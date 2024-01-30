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
	updateDoc,
	getDoc,
	where,
	writeBatch,
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
	setArrayOfActualDetails: React.Dispatch<React.SetStateAction<User[]>>;
	arrayOfActualDetails: User[];
	setNumberOfNotifications: React.Dispatch<React.SetStateAction<number>>;
};

const Left = ({
	isLeftBarOpen,
	toggleLeftBar,
	setUserChats,
	userChats,
	setLoadingForum,
	setArrayOfActualDetails,
	arrayOfActualDetails,
	setNumberOfNotifications,
}: LeftProps) => {
	// console.log('Left');

	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const [innerWidth, setInnerWidth] = useState(0);
	const [userRooms, setUserRoms] = useState<TransformedUserChat[]>([]);
	const [mainChat, setMainChat] = useState<TransformedUserChat[]>([]);

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
			setArrayOfActualDetails(actualDetails);
		});
		return () => {
			unsub1();
		};
	}, [setArrayOfActualDetails]);

	useEffect(() => {
		if (!auth.uid) return;
		const updateIsReadedGroup = async () => {
			try {
				if (!chat.chatKey) return;
				if (chat.chatKey.slice(0, 6) === 'GROUP_') {
					const userChatsSnap = await getDoc(
						doc(db, 'userChats', auth.uid as string)
					);
					if (!userChatsSnap.exists()) return;
					const members = userChatsSnap.data()[chat.chatKey].info.friendsInRoom;
					const membersUID = members.map(
						(member: { uid: string }) => member.uid
					);
					const userChatsQuery = query(
						collection(db, 'userChats'),
						where('__name__', 'in', membersUID)
					);
					const membersDocs = await getDocs(userChatsQuery);
					console.log(membersDocs.docs[0].data());
					const batch = writeBatch(db);

					membersDocs.docs.forEach(docRef => {
						const updatedMembers = members.map(
							(member: { uid: string; isReaded: string }) => ({
								...member,
								isReaded: member.uid === auth.uid ? true : member.isReaded,
							})
						);
						batch.update(docRef.ref, {
							[`${chat.chatKey}.info.friendsInRoom`]: updatedMembers,
						});
					});
					await batch.commit();
				} else {
					const mainChatSnap = await getDoc(
						doc(db, 'userChats', chat.chatKey as string)
					);
					if (!mainChatSnap.exists()) return;
					const membersDoc =
						mainChatSnap.data()[chat.chatKey].info.friendsInRoom;
					const updatedDoc = membersDoc.map(
						(member: { uid: string; isReaded: string }) => ({
							...member,
							isReaded: member.uid === auth.uid ? true : member.isReaded,
						})
					);
					await updateDoc(doc(db, 'userChats', chat.chatKey as string), {
						[`${chat.chatKey}.info.friendsInRoom`]: updatedDoc,
					});
				}
			} catch (error) {
				console.log(error);
			}
		};
		const updateIsReadedPrivate = async (chatKeyToUpdate: string) => {
			try {
				await updateDoc(doc(db, 'userChats', auth.uid as string), {
					[`${chatKeyToUpdate}.isReaded`]: true,
				});
				console.log('update Private');
			} catch (error) {
				console.error(error);
			}
		};
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
						author: data[key]?.author || '',
						isReaded: !!data[key]?.isReaded,
						friendsInRoom: data[key]?.info.friendsInRoom || [],
					};
				}
				return null;
			});

			const hasUnreadMessages = transformedChatsData.some(
				chatItem =>
					chatItem !== null &&
					!chatItem.isReaded &&
					chatItem.key === chat.chatKey
			);

			if (
				chat.chatKey &&
				(chat.chatKey.slice(0, 6) === 'GROUP_' ||
					chat.displayName === 'Czat ogólny')
			) {
				updateIsReadedGroup();
			} else {
				if (hasUnreadMessages) {
					transformedChatsData.forEach(chatItem => {
						if (
							chatItem !== null &&
							!chatItem.isReaded &&
							chatItem.key === chat.chatKey
						) {
							updateIsReadedPrivate(chatItem.key);
						}
					});
				}
			}

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
			const sortedChats = chats.sort((a, b) => b.date - a.date);
			const sortedRooms = rooms.sort((a, b) => b.date - a.date);

			setUserRoms(sortedRooms);
			setUserChats(sortedChats);
		});

		const mainChatKey = process.env
			.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY as string;

		const unsub3 = onSnapshot(doc(db, 'userChats', mainChatKey), doc => {
			const data = doc.data() as UserChat;
			if (!data) return;
			const transformedMainChatData = Object.keys(data).map(key => {
				if (data[key]?.date) {
					return {
						key: key,
						date: data[key].date?.seconds || 0,
						displayName: data[key].info?.displayName || '',
						photoURL: data[key].info?.photoURL || '',
						uid: data[key].info?.uid || '',
						author: data[key]?.author || '',
						isReaded: !!data[key]?.isReaded,
						friendsInRoom: data[key]?.info.friendsInRoom || [],
					};
				}
				return null;
			});
			const main: TransformedUserChat[] = [];
			transformedMainChatData.forEach(item => {
				if (item === null) return;
				if (item.displayName === 'Czat ogólny') {
					main.push(item);
				} else return;
			});
			setMainChat(main);
		});
		return () => {
			unsub2();
			unsub3();
		};
	}, [auth.uid, setUserChats, setUserRoms, setLoadingForum, chat]);

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
				className={`absolute h-calc mt-[56px] px-2 bg-neutral-950 ease-in-out duration-200 transition-transform z-40  ${
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
										const friend = arrayOfActualDetails.find(
											user => user.uid === chat.uid
										);
										const friendActualName = friend?.displayName || '';
										const friendActualAvatar = friend?.photoURL || null;
										return (
											<LeftFriend
												chatKey={chat.key}
												key={chat.uid}
												id={chat.uid}
												isReaded={chat.isReaded}
												photoURL={friendActualAvatar}
												displayName={friendActualName}
												setLoadingForum={setLoadingForum}
												toggleLeftBar={toggleLeftBar}
												setNumberOfNotifications={setNumberOfNotifications}
											/>
										);
									})}
							</ul>
						</div>
						<div className='flex flex-col w-1/2'>
							<LeftRooms
								userChats={userChats}
								userRooms={userRooms}
								toggleLeftBar={toggleLeftBar}
								setLoadingForum={setLoadingForum}
								setNumberOfNotifications={setNumberOfNotifications}
							/>
						</div>
					</div>
					<LeftMain
						toggleLeftBar={toggleLeftBar}
						setLoadingForum={setLoadingForum}
						setNumberOfNotifications={setNumberOfNotifications}
						mainChat={mainChat}
					/>
				</div>
			</section>
		</>
	);
};

export default Left;
