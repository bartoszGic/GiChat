import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Message, User, formatDate } from '../Types/types';
import { useAppSelector } from '@/store';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/app/firebase-config';

type ForumMsgsPrivateReceivedProps = {
	message: Message;
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
	actualFriendName: string;
	actualFriendAvatar: string;
};
const ForumMsgsPrivateReceived = ({
	message,
	setShowImage,
	setImage,
	actualFriendName,
	actualFriendAvatar,
}: ForumMsgsPrivateReceivedProps) => {
	return (
		<div
			key={message.id}
			className='flex mb-2'>
			<div className='flex flex-col bg-slate-50 text-slate-950 px-2 py-2 w-3/4 rounded-t-lg rounded-br-lg sm:max-w-[350px]'>
				<div className='flex flex-row-reverse text-slate-500 justify-between items-center'>
					<div>{formatDate(message.date.seconds)}</div>
					<div className='text-sm font-bold'>{actualFriendName}</div>
				</div>
				<div className='mt-2 text-justify'>{message.message}</div>
				<div className='relative mt-2 text-justify w-40'>
					{message.img && (
						<div
							className='flex flex-col cursor-pointer mt-2'
							onClick={() => {
								setShowImage(true);
								setImage(message.img as string);
							}}>
							<Image
								src={message.img as string}
								alt='przesłany obraz'
								width={160}
								height={160}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ForumMsgsPrivateReceived;
