import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/store';
import { changeUserChat } from '@/store/chat-slice';

type LeftFriendProps = {
	chatKey: string;
	id: string;
	photoURL: string;
	displayName: string;
};
const LeftFriend = ({
	id,
	photoURL,
	displayName,
	chatKey,
}: LeftFriendProps) => {
	const dispatch = useAppDispatch();

	const openFriendChat = () => {
		dispatch(
			changeUserChat({
				chatKey: chatKey,
				chatID: id,
				displayName: displayName,
				photoURL: photoURL,
			})
		);
	};

	return (
		<li className='flex items-center'>
			<button
				className='flex items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
				onClick={openFriendChat}>
				<Image
					className='h-6 w-6 mr-1 rounded-full'
					src={photoURL}
					alt='czlowiek'
					width={40}
					height={40}
				/>
				<div className='whitespace-nowrap overflow-hidden text-xs px-1'>
					{displayName}
				</div>
			</button>
		</li>
	);
};

export default LeftFriend;
