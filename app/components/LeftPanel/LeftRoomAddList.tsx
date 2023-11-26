import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { User } from '../Types/types';
import { TransformedUserChat } from '../Types/types';

type LeftRoomAddListProps = {
	user: TransformedUserChat;
	roomUsers: TransformedUserChat[];
	toggleUser: (friend: TransformedUserChat) => void;
};

const LeftRoomAddList = ({
	user,
	roomUsers,
	toggleUser,
}: LeftRoomAddListProps) => {
	return (
		<li className='flex w-full justify-between items-center py-2 px-1'>
			<div className='flex items-center w-5/6'>
				{user.photoURL && (
					<Image
						className='h-4 w-4 mr-1 rounded-full'
						src={user.photoURL}
						alt='czlowiek'
						width={40}
						height={40}
					/>
				)}
				<span
					className={`${
						!roomUsers.find(friend => friend.uid === user.uid)
							? ''
							: 'text-green-500'
					}`}>
					{user.displayName}
				</span>
			</div>
			{!roomUsers.find(friend => friend.uid === user.uid) ? (
				<button
					type='button'
					onClick={() => toggleUser(user)}>
					<FontAwesomeIcon
						className='scale-150'
						icon={faPlus}
					/>
				</button>
			) : (
				<button
					type='button'
					onClick={() => toggleUser(user)}>
					<FontAwesomeIcon
						className='text-red-500 scale-150'
						icon={faMinus}
					/>
				</button>
			)}
		</li>
	);
};

export default LeftRoomAddList;
