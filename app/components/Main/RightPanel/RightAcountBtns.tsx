import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowRightFromBracket,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';

const RightAcountBtns = () => {
	return (
		<div className='flex justify-around my-2'>
			<button className='flex items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
				<FontAwesomeIcon
					className='p-2'
					icon={faArrowRightFromBracket}
				/>
				Wyloguj
			</button>
			<button className='flex items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
				<FontAwesomeIcon
					className='p-2'
					icon={faTrash}
				/>
				Usuń konto
			</button>
		</div>
	);
};

export default RightAcountBtns;
