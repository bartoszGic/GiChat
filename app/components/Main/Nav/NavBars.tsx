import React from 'react';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type NavBarsProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool: boolean) => void;
};
const NavBars = ({ isLeftBarOpen, toggleLeftBar }: NavBarsProps) => {
	return (
		<>
			{!isLeftBarOpen ? (
				<button
					className='flex sm:hidden'
					onClick={() => toggleLeftBar(false)}>
					<FontAwesomeIcon
						className='w-6 h-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn sm:hidden'
						icon={faBars}
					/>
				</button>
			) : (
				<button
					className='flex sm:hidden'
					onClick={() => toggleLeftBar(true)}>
					<FontAwesomeIcon
						className='w-6 h-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn sm:hidden'
						icon={faXmark}
					/>
				</button>
			)}
		</>
	);
};

export default NavBars;
