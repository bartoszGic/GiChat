import React from 'react';
import { useState, useEffect } from 'react';
type LeftProps = {
	isLeftBarOpen: boolean;
};

const Left = ({ isLeftBarOpen }: LeftProps) => {
	const [innerWidth, setInnerWidth] = useState(0);

	useEffect(() => {
		console.log('effect');
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
		<section
			className={`absolute before:grid grid-cols-1  pt-11 h-screen bg-slate-500 ease-in-out duration-200 transition-transform z-40  ${
				isLeftBarOpen || innerWidth >= 640
					? 'transform translate-x-0 w-2/3 sm:w-1/3'
					: 'transform -translate-x-full w-2/3 sm:w-1/3'
			}`}>
			<div className='grid grid-cols-2 px-2 py-4'>
				<div className='col-span-1'>
					<h3 className='mb-4'>Znajomi</h3>
					<div>
						<div className='whitespace-nowrap overflow-hidden my-2 text-sm'>
							1 Znajomi
						</div>
						<div className='whitespace-nowrap overflow-hidden my-2 text-sm'>
							2 Znajomi
						</div>
					</div>
				</div>
				<div className='col-span-1'>
					<h3 className='mb-4'>Pokoje</h3>
					<div>
						<div className='whitespace-nowrap overflow-hidden my-2 text-sm'>
							1 Czaty
						</div>
						<div className='whitespace-nowrap overflow-hidden my-2 text-sm'>
							2 Czaty
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Left;
