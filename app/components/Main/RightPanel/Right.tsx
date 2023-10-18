import React from 'react';
import Backdrop from '../../UI/Backdrop';
import RightAcountBtns from './RightAcountBtns';
import RightName from './RightName';

type RightProps = {
	isRightBarOpen: boolean;
	toggleRightBar: () => void;
};

const Right = ({ isRightBarOpen, toggleRightBar }: RightProps) => {
	return (
		<>
			{isRightBarOpen && (
				<Backdrop
					onClick={toggleRightBar}
					isRightBarOpen={isRightBarOpen}
				/>
			)}
			<section
				className={`absolute flex flex-col right-0 w-full h-1/2 bg-slate-500 ease-in-out duration-200 transition-transform landscape:h-3/4 sm:h-1/3 sm:w-2/3 z-30 ${
					isRightBarOpen ? 'translate-y-0 mt-11' : '-translate-y-full mt-0'
				}`}>
				<div className='grid px-4 py-6 w-full h-full font-light text-xs sm:text-sm sm:h-1/3'>
					<RightName />
					<div className='grid grid-cols-3 mb-4 p-2 items-center'>
						<div className='text-slate-300'>Email:</div>
						<div className='mx-auto'>Email</div>
					</div>
					<div className='grid grid-cols-3 mb-4 p-2 items-center'>
						<div className='text-slate-300'>Avatar:</div>
						<div className='mx-auto'>Avatar</div>
					</div>
					<RightAcountBtns />
				</div>
			</section>
		</>
	);
};

export default Right;
