import React, { useState, useEffect, useRef } from 'react';
import Backdrop from '../UI/Backdrop';
import Button from '../UI/Button';
import Image from 'next/image';
type ForumProps = {
	isLeftBarOpen: boolean;
	isRightBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
	toggleRightBar: () => void;
};
const Forum = ({
	isRightBarOpen,
	isLeftBarOpen,
	toggleLeftBar,
	toggleRightBar,
}: ForumProps) => {
	const [scroll, setScroll] = useState(0);
	let scrollDown = false;
	const prevScrollValueRef = useRef(0);
	const componentRef = useRef<HTMLDivElement | null>(null);

	const handleScroll = (e: any) => {
		setScroll(e.currentTarget.scrollTop);
	};

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
		<>
			{isRightBarOpen && <Backdrop onClick={toggleRightBar} />}
			<section
				className={`absolute flex flex-col w-full bg-slate-400 ease-in-out duration-200 transition-transform z-0 sm:w-2/3 sm:right-0 sm:h-calc ${
					scrollDown && !isLeftBarOpen
						? 'translate-y-0 sm:translate-y-11'
						: 'translate-y-11'
				} ${isLeftBarOpen ? 'translate-y-0 h-calc' : 'h-full'}`}
				ref={componentRef}>
				<div className='flex justify-end items-center py-3 px-4'>
					<Image
						className='h-10 w-10 mx-2 rounded-full'
						src='/human-3782189_640.jpg'
						alt='czlowiek'
						width={40}
						height={40}
					/>
					<h3>Nazwa konwersacji</h3>
				</div>
				<ul
					className='flex flex-col items-center overflow-y-auto h-full w-full px-2 max-w-full'
					onScroll={handleScroll}>
					<li className='flex flex-row-reverse mb-2 w-full text-xs break-words'>
						<div className='flex flex-col bg-slate-300 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
							<div className='flex text-slate-500 justify-between items-center'>
								<div>12.12.1234</div>
								<div className='text-sm font-bold'>Nick</div>
							</div>
							<div className='mt-2 text-justify'>Lorem ipsum</div>
						</div>
					</li>
					<li className='flex mb-2 w-full text-xs break-words max-w-3/4'>
						<div className='flex flex-col bg-slate-50 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
							<div className='flex flex-row-reverse text-slate-500 justify-between items-center'>
								<div>12.12.1234</div>
								<div className='text-sm font-bold'>Nick</div>
							</div>
							<div className='mt-2 text-justify'>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui
								Lorem ipsum dolor, sit amet consectetur adipisicing elit.
								Molestiae, dolorum! Consequatur, possimus? Ea animi sequi culpa
								at laboriosam consectetur exercitationem, aliquam ut obcaecati
								sed itaque fugit eius provident pariatur numquam?
							</div>
						</div>
					</li>
					<li className='flex mb-2 w-full text-xs break-words max-w-3/4'>
						<div className='flex flex-col bg-slate-50 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
							<div className='flex flex-row-reverse text-slate-500 justify-between items-center'>
								<div>12.12.1234</div>
								<div className='text-sm font-bold'>Nick</div>
							</div>
							<div className='mt-2 text-justify'>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui
								Lorem ipsum dolor, sit amet consectetur adipisicing elit.
								Molestiae, dolorum! Consequatur, possimus? Ea animi sequi culpa
								at laboriosam consectetur exercitationem, aliquam ut obcaecati
								sed itaque fugit eius provident pariatur numquam?
							</div>
						</div>
					</li>
					<li className='flex mb-2 w-full text-xs break-words max-w-3/4'>
						<div className='flex flex-col bg-slate-50 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
							<div className='flex flex-row-reverse text-slate-500 justify-between items-center'>
								<div>12.12.1234</div>
								<div className='text-sm font-bold'>Nick</div>
							</div>
							<div className='mt-2 text-justify'>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui
								Lorem ipsum dolor, sit amet consectetur adipisicing elit.
								Molestiae, dolorum! Consequatur, possimus? Ea animi sequi culpa
								at laboriosam consectetur exercitationem, aliquam ut obcaecati
								sed itaque fugit eius provident pariatur numquam?
							</div>
						</div>
					</li>
					<li className='flex mb-2 w-full text-xs break-words max-w-3/4'>
						<div className='flex flex-col bg-slate-50 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
							<div className='flex flex-row-reverse text-slate-500 justify-between items-center'>
								<div>12.12.1234</div>
								<div className='text-sm font-bold'>Nick</div>
							</div>
							<div className='mt-2 text-justify'>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui
								Lorem ipsum dolor, sit amet consectetur adipisicing elit.
								Molestiae, dolorum! Consequatur, possimus? Ea animi sequi culpa
								at laboriosam consectetur exercitationem, aliquam ut obcaecati
								sed itaque fugit eius provident pariatur numquam?
							</div>
						</div>
					</li>
				</ul>
				<form
					className={`${
						isLeftBarOpen ? 'hidden sm:flex' : 'flex'
					}  w-full h-11 justify-between bg-slate-500`}>
					<textarea
						className='flex text-slate-900 bg-slate-0 text-sm py-2 px-2 resize-none w-2/3'
						placeholder='Napisz wiadomość...'
						maxLength={200}
						id='message'
					/>
					<Button
						text={'Wyślij'}
						backgroundColor={'bg-blue-500'}
					/>
				</form>
			</section>
		</>
	);
};

export default Forum;
