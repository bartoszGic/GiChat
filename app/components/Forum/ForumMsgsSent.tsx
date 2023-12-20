import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Message, formatDate } from '../Types/types';
import { useAppSelector, useAppDispatch } from '@/store';

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
			<div className='flex flex-col bg-slate-300 text-slate-950 px-2 py-2 w-3/4 rounded-t-lg rounded-bl-lg sm:max-w-[350px]'>
				<div className='flex text-slate-500 justify-between items-center'>
					<div>{formatDate(message.date.seconds)}</div>
					<div className='text-sm font-bold'>{auth.displayName}</div>
				</div>
				<div className='mt-2 text-justify'>{message.message}</div>
				<div className='relative mt-2 text-justify w-40'>
					{message.img && (
						<Image
							onClick={() => {
								setShowImage(true);
								setImage(message.img as string);
							}}
							className='w-auto h-auto cursor-pointer mt-2'
							src={message.img as string}
							alt='przesłany obraz'
							width={160}
							height={160}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ForumMsgsSent;
