import React, { useState, useEffect } from 'react';
import Backdrop from '../../UI/Backdrop';
import LeftFriend from './LeftFriend';
import LeftRoom from './LeftRoom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { useAppSelector, useAppDispatch } from '@/store';
import Image from 'next/image';
import { logoutUserChat } from '@/store/chat-slice';

type LeftProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
};

type UserChat = {
	[key: string]: {
		date: {
			seconds: number;
			nanoseconds: number;
		};
		info: {
			displayName: string;
			photoURL: string;
			uid: string;
		};
	};
};
type TransformedUserChat = {
	key: string;
	date: number;
	displayName: string;
	photoURL: string;
	uid: string;
};

const Left = ({ isLeftBarOpen, toggleLeftBar }: LeftProps) => {
	const [innerWidth, setInnerWidth] = useState(0);
	const [userChats, setUserChats] = useState<TransformedUserChat[] | undefined>(
		[]
	);
	const auth = useAppSelector(state => state.auth);
	const dispatch = useAppDispatch();

	const handleMainChat = () => {
		dispatch(logoutUserChat());
	};
	useEffect(() => {
		if (auth.uid) {
			const unsub = onSnapshot(doc(db, 'userChats', auth.uid), doc => {
				const data = doc.data() as UserChat;
				if (data) {
					const transformedData = Object.keys(data).map(key => {
						// Poniżej dodatkowe zabezpieczenia if, filter,? i z powodu błedu wystęującym tylko przy dodawniu nowego znajomego w NavSearch
						if (data[key]?.date) {
							return {
								key: key,
								date: data[key].date?.seconds || 0,
								displayName: data[key].info?.displayName || '',
								photoURL: data[key].info?.photoURL || '',
								uid: data[key].info?.uid || '',
							};
						}
						return null;
					});
					setUserChats(
						transformedData.filter(
							item => item !== null
						) as TransformedUserChat[]
					);
				}
			});
			return () => {
				unsub();
			};
		}
	}, [auth.uid]);

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
					<div className='grid grid-cols-2 px-2 py-4'>
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
						<div className='col-span-1'>
							<h3 className='mb-4'>Pokoje</h3>
							<ul className='grid'>
								<LeftRoom />
							</ul>
						</div>
					</div>
					<button
						className='flex items-center w-full justify-center mb-4 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						onClick={handleMainChat}>
						<span className='mr-2'>Czat ogólny</span>
						<Image
							className=''
							src='/home (1).png'
							alt='czlowiek'
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
