import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/store';
import { User } from '../Types/types';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';

type ForumMembersProps = {
	arrayOfActualDetails: User[];
};

const ForumMembers = ({ arrayOfActualDetails }: ForumMembersProps) => {
	const [showList, setShowList] = useState(false);
	const [membersList, setMembersList] = useState<User[]>([]);
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const listRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const getMembers = async () => {
			try {
				const docSnap = await getDoc(
					doc(db, 'allUsersChatMessages', chat.chatKey as string)
				);

				if (docSnap.exists()) {
					const membersData = docSnap.data().members;

					if (membersData && Array.isArray(membersData)) {
						const list = membersData.map((member: any) => member.uid);
						const newList = arrayOfActualDetails.filter(actualNameAndAvatar =>
							list.includes(actualNameAndAvatar.uid)
						);
						setMembersList(newList);
					}
				}
			} catch (error) {
				console.error(error);
			}
		};

		getMembers();
	}, [chat.chatKey, arrayOfActualDetails]);

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
	}, []);

	return (
		<>
			<button
				className='flex items-center cursor-pointer animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
				onClick={() => setShowList(state => !state)}
				ref={listRef}>
				<FontAwesomeIcon
					className='w-6 h-6 rounded-full'
					icon={faUsers}
				/>
			</button>
			<ul
				className={`${
					showList ? 'flex' : 'hidden'
				} flex-col justify-start absolute left-14 top-0 px-2 py-2 text-xs rounded-md text-neutral-50 w-40 bg-neutral-700 max-h-40 max-w-[160px] overflow-y-auto z-30`}>
				<div className='w-full text-sm my-2 text-center tracking-wider text-neutral-400'>
					Członkowie grupy
				</div>
				{membersList.map(user => (
					<li
						key={user.uid}
						className='flex justify-between items-center py-2'>
						<div className='flex items-center'>
							{user.photoURL ? (
								<Image
									className='h-5 w-5 mr-2 rounded-full'
									src={user.photoURL as string}
									alt='ikona użytkownika'
									width={40}
									height={40}
								/>
							) : (
								<FontAwesomeIcon
									className='w-5 h-5 mr-2 rounded-full'
									icon={faUser}
								/>
							)}
							{user.displayName === auth.displayName ? (
								<div className='text-cyan-500'>{auth.displayName}</div>
							) : (
								<div>{user.displayName}</div>
							)}
						</div>
					</li>
				))}
			</ul>
		</>
	);
};

export default ForumMembers;
