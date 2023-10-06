import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBars,
	faXmark,
	faUser,
	faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

type NavProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool: boolean) => void;
	toggleRightBar: () => void;
};

const Nav = ({ isLeftBarOpen, toggleLeftBar, toggleRightBar }: NavProps) => {
	// console.log('Nav');

	return (
		<nav className='flex w-full items-center z-0'>
			<div className='flex justify-between w-full p-2 items-center bg-slate-500'>
				<h3 className='hidden sm:flex tracking-widest font-bold ml-2'>
					GiChat
				</h3>
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
				<div className='flex items-center'>
					<form className='flex'>
						<div className='relative flex flex-col'>
							<input
								type='text'
								className='px-2 py-1 mr-4 h-6 w-40 text-xs text-slate-50 items-center bg-slate-500 placeholder-slate-300 sm:text-sm sm:w-48'
								id='search'
								placeholder='Wyszukaj użytkownika...'
							/>
							{/* <ul className='absolute flex flex-col left-0 top-7 px-2 py-1 text-xs text-slate-50 justify-center w-40 bg-slate-500 sm:text-sm sm:w-48'>
								<li className='py-1'>Użytkownik1</li>
								<li className='py-1'>Użytkownik1</li>
								<li className='py-1'>Użytkownik1</li>
							</ul> */}
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
					<button
						className='flex'
						onClick={() => toggleRightBar()}>
						<FontAwesomeIcon
							className='w-5 h-5 py-1 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
							icon={faUser}
						/>
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Nav;
