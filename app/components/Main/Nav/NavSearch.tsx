import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
	faMagnifyingGlass,
	faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase-config';

type User = {
	displayName: string;
	email: string;
};
const NavSearch = () => {
	const [searchUser, setSearchUser] = useState('');
	const [existingUsers, setExistingUsers] = useState<User[]>([]);
	const [showList, setShowList] = useState(false);
	const searchListRef = useRef<HTMLFormElement | null>(null);

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const usersRef = collection(db, 'users');
		const q = query(usersRef, where('displayName', '==', searchUser));
		try {
			const querySnapshot = await getDocs(q);
			const usersData: User[] = [];
			querySnapshot.forEach(doc => {
				usersData.push(doc.data() as User);
			});
			setExistingUsers(usersData);
			setShowList(true);
		} catch (error) {
			console.log(error);
		}
	};
	console.log(existingUsers);
	useEffect(() => {
		const outsideClickCatch = (e: MouseEvent) => {
			if (searchListRef.current) {
				const target = e.target as Node;
				if (!searchListRef.current.contains(target)) {
					setShowList(false);
					setSearchUser('');
				}
			}
		};
		document.addEventListener('mousedown', outsideClickCatch);
		return () => {
			document.removeEventListener('mousedown', outsideClickCatch);
		};
	}, []);

	return (
		<form
			className='flex'
			onSubmit={handleSearch}
			ref={searchListRef}>
			<div className='relative flex flex-col'>
				<input
					type='text'
					className='px-2 py-1 mr-4 h-6 w-40 text-xs text-slate-50 items-center bg-slate-500 placeholder-slate-300 sm:text-sm sm:w-48'
					id='search'
					placeholder='Wyszukaj użytkownika...'
					onChange={e => setSearchUser(e.target.value)}
					value={searchUser}
				/>
				<ul
					className={`${
						showList ? 'flex flex-col' : 'hidden'
					} absolute left-0 top-7 px-2 py-1 text-xs text-slate-50 justify-center w-40 bg-slate-500 sm:text-sm sm:w-48`}>
					{existingUsers.length !== 0 ? (
						existingUsers.map(user => (
							<li
								key={user.email}
								className='flex justify-between items-center py-1 overflow-hidden'>
								{user.displayName}
								<button>
									<FontAwesomeIcon
										className='text-green-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
										icon={faUserPlus}
									/>
								</button>
							</li>
						))
					) : (
						<li className='flex justify-between items-center py-1 overflow-hidden'>
							No users found
						</li>
					)}
				</ul>
			</div>
			<button
				className='flex mr-4'
				type='submit'>
				<FontAwesomeIcon
					className='w-5 h-5 py-1 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
					icon={faMagnifyingGlass}
				/>
			</button>
		</form>
	);
};

export default NavSearch;
