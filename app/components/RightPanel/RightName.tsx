import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

const RightName = () => {
	return (
		<form className='grid grid-cols-3 items-center justify-center mb-4 p-1 text-slate-50'>
			<label
				className='text-slate-300'
				htmlFor='username'>
				Nazwa użytkownika:
			</label>
			<input
				className='bg-slate-400 h-6 w-24 py-1 px-2 mx-auto'
				type='text'
				id='username'
				name='username'
				placeholder='Email:'
			/>
			<button
				className='flex justify-center items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn mx-auto p-1'
				type='submit'>
				<FontAwesomeIcon icon={faArrowsRotate} />
			</button>
		</form>
	);
};

export default RightName;
