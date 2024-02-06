import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { auth } from '@/app/firebase-config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../store';
import { logOutUser } from '@/store/auth-slice';
import { logoutUserChat } from '@/store/chat-slice';

const RightAcountBtns = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const logOutHandler = async () => {
		try {
			await signOut(auth);
			dispatch(logOutUser());
			dispatch(logoutUserChat());
			router.push('/');
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='flex px-4'>
			<button
				className='flex px-4 py-2 items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn bg-red-500 rounded-full'
				onClick={logOutHandler}>
				<FontAwesomeIcon
					className=''
					icon={faArrowRightFromBracket}
				/>
				<span className='ml-2'>Wyloguj</span>
			</button>
		</div>
	);
};

export default RightAcountBtns;
