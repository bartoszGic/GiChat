import React from 'react';
import Image from 'next/image';

const LeftRoom = () => {
	return (
		<li className='flex items-center'>
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
		</li>
	);
};

export default LeftRoom;
