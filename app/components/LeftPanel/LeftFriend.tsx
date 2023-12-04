import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/store';
import {
	changeUserChat,
	updateDisplayNameAndPhotoURL,
} from '@/store/chat-slice';

type LeftFriendProps = {
	chatKey: string;
	id: string;
	photoURL: string | null;
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
				displayName: '',
				photoURL: '',
			})
		);
	};

	return (
		<li className='flex items-center'>
			<button
				className='flex items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
				onClick={openFriendChat}>
				{photoURL && (
					<Image
						className='h-6 w-6 mr-1 rounded-full'
						src={photoURL}
						alt='ikona użytkownika'
						width={40}
						height={40}
					/>
				)}
				<span className='whitespace-nowrap overflow-hidden text-xs px-1'>
					{displayName}
				</span>
			</button>
		</li>
	);
};

export default LeftFriend;
