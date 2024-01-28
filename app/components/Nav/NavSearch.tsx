import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
	faMagnifyingGlass,
	faUserPlus,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { User, TransformedUserChat } from '../Types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	collection,
	query,
	where,
	getDocs,
	getDoc,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase-config';
import { useAppSelector } from '@/store';

type NavSearchProps = {
	setForumStyleZ: React.Dispatch<React.SetStateAction<string>>;
	userChats: TransformedUserChat[] | undefined;
};

const NavSearch = ({ setForumStyleZ, userChats }: NavSearchProps) => {
	// console.log('NavSearch');
	const [searchUser, setSearchUser] = useState('');
	const [existingUsers, setExistingUsers] = useState<User[]>([]);
	const [showList, setShowList] = useState(false);
	const [loading, setLoading] = useState(false);
	const searchListRef = useRef<HTMLFormElement | null>(null);
	const auth = useAppSelector(state => state.auth);

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		const usersRef = collection(db, 'users');
		const usersQ = query(usersRef, where('displayName', '==', searchUser));
		try {
			const usersQSnapshot = await getDocs(usersQ);
			const usersData: User[] = [];
			usersQSnapshot.forEach(doc => {
				usersData.push(doc.data() as User);
			});
			const currentUserIndex = usersData.findIndex(
				user => user.uid === auth.uid
			);
			currentUserIndex !== -1 && usersData.splice(currentUserIndex, 1);
			setExistingUsers(usersData);
			setLoading(false);
			setShowList(true);
			setForumStyleZ('-z-10');
		} catch (error) {
			console.log(error);
		}
	};

	const addFriend = async (findedUser: User) => {
		if (auth.uid === null) return;
		try {
			const combinedId =
				auth.uid > findedUser.uid
					? auth.uid + findedUser.uid
					: findedUser.uid + auth.uid;
			const docSnap = await getDoc(doc(db, 'allUsersChatMessages', combinedId));
			if (!docSnap.exists()) {
				await setDoc(doc(db, 'allUsersChatMessages', combinedId), {
					messages: [],
				});

				await updateDoc(doc(db, 'userChats', findedUser.uid), {
					[`${combinedId}.info`]: {
						uid: auth.uid,
						displayName: auth.displayName,
						photoURL: auth.photoURL,
					},
					[`${combinedId}.date`]: serverTimestamp(),
					[`${combinedId}.author`]: '',
					[`${combinedId}.isReaded`]: true,
				});
				await updateDoc(doc(db, 'userChats', auth.uid), {
					[`${combinedId}.info`]: {
						uid: findedUser.uid,
						displayName: findedUser.displayName,
						photoURL: findedUser.photoURL,
					},
					[`${combinedId}.date`]: serverTimestamp(),
					[`${combinedId}.author`]: '',
					[`${combinedId}.isReaded`]: true,
				});
			}
		} catch (error: any) {
			console.log(error);
		}
		setShowList(false);
		setSearchUser('');
		setForumStyleZ('z-0');
	};

	useEffect(() => {
		const outsideClickCatch = (e: MouseEvent) => {
			if (searchListRef.current) {
				const target = e.target as Node;
				if (!searchListRef.current.contains(target)) {
					setShowList(false);
					setSearchUser('');
					setForumStyleZ('z-0');
				}
			}
		};
		document.addEventListener('mousedown', outsideClickCatch);
		return () => {
			document.removeEventListener('mousedown', outsideClickCatch);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<form
			className='flex items-center'
			onSubmit={handleSearch}
			ref={searchListRef}>
			<div className='relative flex flex-col'>
				<input
					type='text'
					className='flex items-center px-3 py-1 mr-4 h-8 w-40 text-xs rounded-full text-neutral-50 bg-neutral-700 placeholder-neutral-400 sm:text-sm sm:w-48'
					id='search'
					placeholder='Szukaj użytkownika...'
					onChange={e => setSearchUser(e.target.value)}
					value={searchUser}
				/>
				<ul
					className={`${
						showList ? 'flex flex-col' : 'hidden'
					} absolute left-0 top-9 px-2 py-1 text-xs text-neutral-50 justify-center w-40 bg-neutral-700 rounded-xl z-30 sm:text-sm sm:w-48`}>
					{existingUsers.length !== 0 ? (
						existingUsers.map(user => (
							<li
								key={user.email}
								className='flex justify-between items-center py-2 px-1 overflow-hidden'>
								<div className='overflow-hidden'>{user.displayName}</div>
								{userChats &&
									!userChats.some(
										existingUser => existingUser.uid === user.uid
									) && (
										<button
											type='button'
											className='ml-2'
											onClick={() => addFriend(user)}>
											<FontAwesomeIcon
												className='text-green-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
												icon={faUserPlus}
											/>
										</button>
									)}
							</li>
						))
					) : (
						<li className='flex justify-center items-center py-1 overflow-hidden'>
							Brak użytkownika
						</li>
					)}
				</ul>
			</div>
			{!loading ? (
				<button
					className='flex mr-4'
					type='submit'>
					<FontAwesomeIcon
						className='w-5 h-5 py-1 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						icon={faMagnifyingGlass}
					/>
				</button>
			) : (
				<button
					className='flex mr-4'
					type='submit'>
					<FontAwesomeIcon
						className='w-5 h-5 py-1'
						icon={faSpinner}
						spin
					/>
				</button>
			)}
		</form>
	);
};

export default NavSearch;
