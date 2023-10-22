import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Backdrop from '../../UI/Backdrop';
import LeftFriend from './LeftFriend';
import LeftRoom from './LeftRoom';
type LeftProps = {
	isLeftBarOpen: boolean;
	toggleLeftBar: (bool?: boolean) => void;
};

const Left = ({ isLeftBarOpen, toggleLeftBar }: LeftProps) => {
	const [innerWidth, setInnerWidth] = useState(0);
	useEffect(() => {
		const updateInnerWidth = () => {
			setInnerWidth(window.innerWidth);
		};
		updateInnerWidth();
		window.addEventListener('resize', updateInnerWidth);
		return () => {
			window.removeEventListener('resize', updateInnerWidth);
		};
	}, [setInnerWidth]);

	return (
		<>
			{isLeftBarOpen && (
				<Backdrop
					onClick={toggleLeftBar}
					bool={isLeftBarOpen}
				/>
			)}
			<section
				className={`absolute h-calc mt-11 bg-slate-500 ease-in-out duration-200 transition-transform z-40  ${
					isLeftBarOpen || innerWidth >= 640
						? 'transform translate-x-0 w-3/4 sm:w-1/3'
						: 'transform -translate-x-full w-2/3 sm:w-1/3'
				}`}>
				<div className='grid grid-cols-2 px-2 py-4'>
					<div>
						<h3 className='mb-4'>Znajomi</h3>
						<ul className='grid'>
							<LeftFriend />
						</ul>
					</div>
					<div className='col-span-1'>
						<h3 className='mb-4'>Pokoje</h3>
						<ul className='grid'>
							<LeftRoom />
						</ul>
					</div>
				</div>
			</section>
		</>
	);
};

export default Left;
