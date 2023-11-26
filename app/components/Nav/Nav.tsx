import React from 'react';
// import { Dispatch, setSt } from 'react';
import NavBars from './NavBars';
import NavSearch from './NavSearch';
import NavUser from './NavUser';
import { TransformedUserChat } from '../Types/types';

type NavProps = {
	isLeftBarOpen: boolean;
	isRightBarOpen: boolean;
	toggleLeftBar: (bool: boolean) => void;
	toggleRightBar: () => void;
	setForumStyleZ: React.Dispatch<React.SetStateAction<string>>;
	userChats: TransformedUserChat[] | undefined;
};

const Nav = ({
	isLeftBarOpen,
	isRightBarOpen,
	toggleLeftBar,
	toggleRightBar,
	setForumStyleZ,
	userChats,
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
					<NavSearch
						setForumStyleZ={setForumStyleZ}
						userChats={userChats}
					/>
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
