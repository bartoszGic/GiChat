import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { logoutUserChat } from '@/store/chat-slice';
import Image from 'next/image';

const LeftMain = () => {
	// console.log('LeftMain');
	const chat = useAppSelector(state => state.chat);
	const [color, setColor] = useState('');
	const dispatch = useAppDispatch();

	return (
		<button
			className={`${
				chat.displayName === 'Czat ogólny' ? 'bg-slate-400' : 'bg-transparent'
			} flex items-center justify-center w-4/5 py-2 mb-6 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn`}
			onClick={() => dispatch(logoutUserChat())}>
			<span className='mr-2'>Czat ogólny</span>
			<Image
				src='/home (1).png'
				alt='czat ogólny'
				width={20}
				height={20}
			/>
		</button>
	);
};

export default LeftMain;
