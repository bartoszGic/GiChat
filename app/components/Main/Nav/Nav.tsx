import React from 'react';
import NavBars from './NavBars';
import NavSearch from './NavSearch';
import NavUser from './NavUser';

type NavProps = {
	isLeftBarOpen: boolean;
	isRightBarOpen: boolean;
	toggleLeftBar: (bool: boolean) => void;
	toggleRightBar: () => void;
};

const Nav = ({
	isLeftBarOpen,
	isRightBarOpen,
	toggleLeftBar,
	toggleRightBar,
}: NavProps) => {
	// console.log('Nav');

	return (
		<nav className='flex w-full items-center z-0'>
			<div className='flex justify-between w-full p-2 items-center bg-slate-500'>
				<h3 className='hidden sm:flex tracking-widest font-bold ml-2'>
					GiChat
				</h3>
				<NavBars
					isLeftBarOpen={isLeftBarOpen}
					toggleLeftBar={toggleLeftBar}
				/>
				<div className='flex items-center justify-end w-full'>
					<NavSearch />
					<NavUser
						isRightBarOpen={isRightBarOpen}
						toggleRightBar={toggleRightBar}
					/>
				</div>
			</div>
		</nav>
	);
};

export default Nav;
