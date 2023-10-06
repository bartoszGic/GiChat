import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
type LeftProps = {
	isLeftBarOpen: boolean;
};

const Left = ({ isLeftBarOpen }: LeftProps) => {
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
			<section
				className={`absolute h-calc mt-11 bg-slate-500 ease-in-out duration-200 transition-transform z-10  ${
					isLeftBarOpen || innerWidth >= 640
						? 'transform translate-x-0 w-3/4 sm:w-1/3'
						: 'transform -translate-x-full w-2/3 sm:w-1/3'
				}`}>
				<div className='grid grid-cols-2 px-2 py-4'>
					<div>
						<h3 className='mb-4'>Znajomi</h3>
						<div className='grid'>
							<div className='flex items-center'>
								<Image
									className='h-6 w-6 mr-1 rounded-full'
									src='/human-3782189_640.jpg'
									alt='czlowiek'
									width={40}
									height={40}
								/>
								<div className='whitespace-nowrap overflow-hidden text-xs px-1'>
									Znajomydds
								</div>
							</div>
						</div>
					</div>
					<div className='col-span-1'>
						<h3 className='mb-4'>Pokoje</h3>
						<div className='grid'>
							<div className='flex items-center'>
								<Image
									className='h-6 w-6 mr-1 rounded-full'
									src='/human-3782189_640.jpg'
									alt='czlowiek'
									width={40}
									height={40}
								/>
								<div className='whitespace-nowrap overflow-hidden text-xs px-1'>
									Znajomydds
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Left;
