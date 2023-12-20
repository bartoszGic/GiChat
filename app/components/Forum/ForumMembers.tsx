import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/store';
import { User } from '../Types/types';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';

type ForumMembersProps = {
	arrayOfActualNames: User[];
};

const ForumMembers = ({ arrayOfActualNames }: ForumMembersProps) => {
	const [showList, setShowList] = useState(false);
	const [membersList, setMembersList] = useState<User[]>([]);
	const auth = useAppSelector(state => state.auth);
	const chat = useAppSelector(state => state.chat);
	const listRef = useRef<HTMLDivElement | null>(null);

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
						const newList = arrayOfActualNames.filter(actualNameAndAvatar =>
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
	}, [chat.chatKey, arrayOfActualNames]);

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
				} flex-col justify-start absolute left-0 top-0 px-2 py-1 text-xs text-slate-50 w-40 bg-slate-500 max-h-40 max-w-[160px] overflow-y-auto z-30`}>
				{membersList.map(user => (
					<li
						key={user.uid}
						className='flex justify-between items-center py-1'>
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
	);
};

export default ForumMembers;
