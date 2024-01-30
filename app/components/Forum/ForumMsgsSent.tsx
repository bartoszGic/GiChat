import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Message, formatDate } from '../Types/types';
import { useAppSelector, useAppDispatch } from '@/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

type ForumMsgsSentProps = {
	message: Message;
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
};
const ForumMsgsSent = ({
	message,
	setShowImage,
	setImage,
}: ForumMsgsSentProps) => {
	const auth = useAppSelector(state => state.auth);
	const refOne = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		refOne.current?.scrollIntoView({ behavior: 'smooth' });
	});
	return (
		<div
			key={message.id}
			ref={refOne}
			className='flex flex-row-reverse mb-2'>
			{auth.photoURL ? (
				<Image
					className='h-6 w-6 rounded-full ml-2'
					src={auth.photoURL as string}
					alt='przesłany obraz'
					width={40}
					height={40}
				/>
			) : (
				<FontAwesomeIcon
					className='h-6 w-6 rounded-full ml-2'
					icon={faUser}
				/>
			)}
			<div className='flex flex-col bg-cyan-500 text-neutral-50 px-2 py-2 w-3/4 rounded-lg sm:max-w-[350px]'>
				<div className='flex text-neutral-600 justify-between items-center'>
					<div>{formatDate(message.date.seconds)}</div>
					<div className='text-sm font-bold'>{auth.displayName}</div>
				</div>
				<div className='mt-2 text-justify'>{message.message}</div>
				<div className='relative mt-2 text-justify w-40 rounded-lg'>
					{message.img && (
						<div
							className='flex flex-col cursor-pointer mt-2'
							onClick={() => {
								setShowImage(true);
								setImage(message.img as string);
							}}>
							<Image
								className='w-40 h-auto overflow-hidden rounded-md'
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

export default ForumMsgsSent;
