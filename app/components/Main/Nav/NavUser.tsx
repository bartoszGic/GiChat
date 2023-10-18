import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
type NavUser = {
	isRightBarOpen: boolean;
	toggleRightBar: () => void;
};
const NavUser = ({ isRightBarOpen, toggleRightBar }: NavUser) => {
	return (
		<>
			{!isRightBarOpen ? (
				<button
					className='flex'
					onClick={() => toggleRightBar()}>
					<FontAwesomeIcon
						className='w-5 h-5 py-1 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						icon={faUser}
					/>
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
