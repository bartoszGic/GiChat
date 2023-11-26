import React from 'react';
import { useAppDispatch } from '@/store';
import { changeUserChat } from '@/store/chat-slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

type LeftRoomsRoomProps = {
	chatKey: string;
	id: string;
	photoURL: string;
	displayName: string | null;
};
const LeftRoomsRoom = ({
	id,
	photoURL,
	displayName,
	chatKey,
}: LeftRoomsRoomProps) => {
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
			className='flex items-center'>
			<button
				onClick={openRoomChat}
				className='flex h-6 items-center animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
				{photoURL && (
					<Image
						className='h-6 w-6 mr-1 rounded-full'
						src={photoURL}
						alt='czlowiek'
						width={40}
						height={40}
					/>
				)}

				<div className='whitespace-nowrap overflow-hidden text-xs'>
					{displayName}
				</div>
			</button>
		</li>
	);
};

export default LeftRoomsRoom;
