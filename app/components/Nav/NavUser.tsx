import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useAppSelector } from '@/store';
type NavUser = {
	isRightBarOpen: boolean;
	toggleRightBar: () => void;
};
const NavUser = ({ isRightBarOpen, toggleRightBar }: NavUser) => {
	const auth = useAppSelector(state => state.auth);

	return (
		<>
			{!isRightBarOpen ? (
				<button
					className='flex items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
					onClick={() => toggleRightBar()}>
					{auth.photoURL ? (
						<Image
							className='h-6 w-6 mr-1 rounded-full'
							src={auth.photoURL as string}
							alt='ikona użytkownika'
							width={40}
							height={40}
						/>
					) : (
						<FontAwesomeIcon
							className='w-5 h-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
							icon={faUser}
						/>
					)}
				</button>
			) : (
				<button
					className='flex'
					onClick={() => toggleRightBar()}>
					<FontAwesomeIcon
						className='w-5 h-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						icon={faXmark}
					/>
				</button>
			)}
		</>
	);
};

export default NavUser;
