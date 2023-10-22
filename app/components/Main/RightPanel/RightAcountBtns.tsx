import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowRightFromBracket,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { auth } from '@/app/firebase-config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const RightAcountBtns = () => {
	const router = useRouter();

	const logOutHandler = async () => {
		try {
			await signOut(auth);
			router.push('/');
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='flex justify-end my-2'>
			<button
				className='flex items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
				onClick={logOutHandler}>
				<FontAwesomeIcon
					className='p-2'
					icon={faArrowRightFromBracket}
				/>
				Wyloguj
			</button>
			{/* <button className='flex items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
				<FontAwesomeIcon
					className='p-2'
					icon={faTrash}
				/>
				Usuń konto
			</button> */}
		</div>
	);
};

export default RightAcountBtns;
