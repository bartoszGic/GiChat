import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ForumMsgs from './ForumMsgs';
import ForumInput from './ForumInput';
import { useAppSelector } from '@/store';
type ForumProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	forumStyleZ: string;
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
};
const Forum = ({
	isLeftBarOpen,
	toggleLeftBar,
	forumStyleZ,
	setShowImage,
	setImage,
}: ForumProps) => {
	const chat = useAppSelector(state => state.chat);

	useEffect(() => {
		const handleWindowResize = () => {
			window.innerWidth >= 640 ? toggleLeftBar(false) : toggleLeftBar(true);
		};
		window.addEventListener('resize', handleWindowResize);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, [toggleLeftBar]);

	return (
		<section
			className={`absolute flex flex-col w-full bg-slate-400 ease-in-out duration-200 transition-transform ${forumStyleZ} translate-y-11 sm:w-2/3 sm:right-0 h-calc`}>
			<div className='flex justify-end items-center py-3 px-4'>
				<h3 className='mr-2'>{chat.displayName}</h3>
				<Image
					className='rounded-full'
					src={chat.photoURL as string}
					alt='zdjęcie znajomego'
					width={30}
					height={30}
				/>
			</div>
			<ForumMsgs
				setShowImage={setShowImage}
				setImage={setImage}
			/>
			<ForumInput isLeftBarOpen={isLeftBarOpen} />
		</section>
	);
};

export default Forum;
