import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ForumMsg from './ForumMsg';
import ForumInput from './ForumInput';

type ForumProps = {
	isLeftBarOpen: boolean;
	isRightBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	toggleRightBar: () => void;
};
const Forum = ({ isLeftBarOpen, toggleLeftBar }: ForumProps) => {
	const [scroll, setScroll] = useState<number>(0);
	let scrollDown: boolean = false;
	const prevScrollValueRef = useRef<number>(0);

	scroll > prevScrollValueRef.current
		? (scrollDown = true)
		: (scrollDown = false);
	useEffect(() => {
		prevScrollValueRef.current = scroll;
	}, [scroll]);

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
			className={`absolute flex flex-col w-full bg-slate-400 ease-in-out duration-200 transition-transform -z-10 sm:w-2/3 sm:right-0 sm:h-calc ${
				scrollDown && !isLeftBarOpen
					? 'translate-y-0 sm:translate-y-11'
					: 'translate-y-11'
			} ${isLeftBarOpen ? 'translate-y-0 h-calc' : 'h-full'}`}>
			<div className='flex justify-end items-center py-3 px-4'>
				<h3 className='mr-2'>Nazwa konwersacji</h3>
				<Image
					className='h-10 w-10 rounded-full'
					src='/human-3782189_640.jpg'
					alt='czlowiek'
					width={40}
					height={40}
				/>
			</div>
			<ul
				className='flex flex-col items-center overflow-y-auto h-full w-full px-2 max-w-full'
				onScroll={e => setScroll(e.currentTarget.scrollTop)}>
				<ForumMsg />
			</ul>
			<ForumInput isLeftBarOpen={isLeftBarOpen} />
		</section>
	);
};

export default Forum;
