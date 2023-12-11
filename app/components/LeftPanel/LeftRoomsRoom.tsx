import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeUserChat } from '@/store/chat-slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type LeftRoomsRoomProps = {
	chatKey: string;
	id: string;
	photoURL: string;
	displayName: string;
};
const LeftRoomsRoom = ({
	id,
	photoURL,
	displayName,
	chatKey,
}: LeftRoomsRoomProps) => {
	// console.log('LeftRoomsRoom');
	const chat = useAppSelector(state => state.chat);
	const [color, setColor] = useState('');
	const dispatch = useAppDispatch();

	const openRoomChat = () => {
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
		<li
			key={chatKey}
			className={`flex items-center p-2 overflow-x-hidden ${
				id === chat.chatID ? 'bg-slate-400' : 'bg-transparent'
			}`}>
			<button
				onClick={openRoomChat}
				className='flex items-center overflow-x-hidden animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
				<Image
					className='h-5 w-5 mr-1 rounded-full'
					src={photoURL as string}
					alt='ikona użytkownika'
					width={40}
					height={40}
				/>
				<div className='whitespace-nowrap overflow-x-hidden text-xs'>
					{displayName}
				</div>
			</button>
		</li>
	);
};

export default LeftRoomsRoom;
