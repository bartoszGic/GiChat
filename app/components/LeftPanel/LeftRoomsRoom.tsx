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
	toggleLeftBar: (bool?: boolean) => void;
};
const LeftRoomsRoom = ({
	id,
	photoURL,
	displayName,
	chatKey,
	toggleLeftBar,
}: LeftRoomsRoomProps) => {
	// console.log('LeftRoomsRoom');
	const chat = useAppSelector(state => state.chat);
	const [color, setColor] = useState('');
	const dispatch = useAppDispatch();

	const openRoomChat = () => {
		toggleLeftBar(true);
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
				{photoURL ? (
					<Image
						className='h-5 w-5 mr-1 rounded-full'
						src={photoURL as string}
						alt='ikona użytkownika'
						width={40}
						height={40}
					/>
				) : (
					<FontAwesomeIcon
						className='w-6 h-6 rounded-full mr-2 cursor-pointer animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						icon={faUsers}
					/>
				)}

				<div className='whitespace-nowrap overflow-x-hidden text-xs'>
					{displayName}
				</div>
			</button>
		</li>
	);
};

export default LeftRoomsRoom;
