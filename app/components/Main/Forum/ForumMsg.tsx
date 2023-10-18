import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
type ForumMsg = {};
const ForumMsg = ({}: ForumMsg) => {
	return (
		<>
			<li className='flex flex-row-reverse mb-2 w-full text-xs break-words'>
				<div className='flex flex-col bg-slate-300 text-slate-950 px-2 py-2 w-3/4 sm:max-w-[350px]'>
					<div className='flex text-slate-500 justify-between items-center'>
						<div>12.12.1234</div>
						<div className='text-sm font-bold'>Nick</div>
					</div>
					<div className='mt-2 text-justify'>
						elo elo 320 Lorem ipsum dolor sit amet.
						<Image
							src='/human-3782189_640.jpg'
							alt='czlowiek'
							width={100}
							height={100}
						/>
					</div>
				</div>
			</li>
		</>
	);
};

export default ForumMsg;
