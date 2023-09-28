import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowRightFromBracket,
	faTrash,
	faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';

type RightProps = {
	isRightBarOpen: boolean;
};

const Right = ({ isRightBarOpen }: RightProps) => {
	return (
		<>
			<section
				className={`absolute flex flex-col justify-between right-0 w-screen pt-11 h-2/3 bg-slate-500 ease-in-out duration-200 transition-transform sm:h-1/3 sm:w-2/3 z-40 ${
					isRightBarOpen ? 'translate-y-0' : '-translate-y-full'
				}`}>
				<div className='grid px-4 py-6 w-full font-light text-xs sm:text-sm'>
					<div className='grid grid-cols-3 items-center justify-center mb-4 p-1 text-slate-50'>
						<div className='text-slate-300'>Nazwa użytkownika:</div>
						<input
							className='bg-slate-400 h-6 w-24 py-1 px-2 mx-auto'
							type='text'
							id='username'
							name='username'
							placeholder='Email:'
						/>
						<button className='flex justify-center items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn mx-auto p-1'>
							<FontAwesomeIcon icon={faArrowsRotate} />
						</button>
					</div>
					<div className='grid grid-cols-3 mb-4 p-2 items-center'>
						<div className='text-slate-300'>Email:</div>
						<div className='mx-auto'>Email</div>
					</div>
					<div className='grid grid-cols-3 mb-4 p-2 items-center'>
						<div className='text-slate-300'>Avatar:</div>
						<div className='mx-auto'>Avatar</div>
					</div>
				</div>
				<div className='flex justify-around my-4'>
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
			</section>
		</>
	);
};

export default Right;
