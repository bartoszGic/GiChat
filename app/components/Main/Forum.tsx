import React, { useState, useEffect } from 'react';
import Backdrop from '../UI/Backdrop';
type ForumProps = {
	isLeftBarOpen: boolean;
	isRightBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	toggleRightBar: () => void;
};

const Forum = ({
	isLeftBarOpen,
	isRightBarOpen,
	toggleLeftBar,
	toggleRightBar,
}: ForumProps) => {
	useEffect(() => {
		const handleWindowResize = () => {
			if (window.innerWidth >= 640) {
				toggleLeftBar(false);
			} else {
				toggleLeftBar(true);
			}
		};
		window.addEventListener('resize', handleWindowResize);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, [toggleLeftBar]);
	console.log(isLeftBarOpen);
	return (
		<>
			{isLeftBarOpen && window.innerWidth <= 640 && (
				<Backdrop onClick={toggleLeftBar} />
			)}
			{isRightBarOpen && <Backdrop onClick={toggleRightBar} />}
			<section className='absolute flex w-screen sm:w-2/3 sm:right-0 -z-50'>
				<div className='bg-slate-800 pt-10 w-full h-screen'></div>
			</section>
		</>
	);
};

export default Forum;
