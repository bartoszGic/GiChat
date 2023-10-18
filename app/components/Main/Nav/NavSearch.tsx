import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
	faMagnifyingGlass,
	faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavSearch = () => {
	const [showList, setShowList] = useState<boolean>(true);
	const searchListRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		const outsideClickCatch = (e: MouseEvent) => {
			if (searchListRef.current) {
				const target = e.target as Node;
				if (!searchListRef.current.contains(target)) {
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
		<form className='flex'>
			<div className='relative flex flex-col'>
				<input
					type='text'
					className='px-2 py-1 mr-4 h-6 w-40 text-xs text-slate-50 items-center bg-slate-500 placeholder-slate-300 sm:text-sm sm:w-48'
					id='search'
					placeholder='Wyszukaj użytkownika...'
				/>
				<ul
					className={`${
						showList ? 'flex flex-col' : 'hidden'
					} absolute left-0 top-7 px-2 py-1 text-xs text-slate-50 justify-center w-40 bg-slate-500 sm:text-sm sm:w-48`}
					ref={searchListRef}>
					<li className='flex justify-between items-center py-1 overflow-hidden'>
						Użytkownik1
						<button>
							<FontAwesomeIcon
								className='text-green-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
								icon={faUserPlus}
							/>
						</button>
					</li>
					<li className='py-1'>Użytkownik1</li>
					<li className='py-1'>Użytkownik1</li>
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
