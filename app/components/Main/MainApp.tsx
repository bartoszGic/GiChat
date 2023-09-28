'use client';
import React from 'react';
import { useState } from 'react';
import Left from './Left';
import Nav from './Nav';
import Right from './Right';
import Forum from './Forum';

const MainApp = () => {
	// console.log('Main');
	const [isLeftBarOpen, setIsLeftbarOpen] = useState(false);
	const [isRightBarOpen, setIsRightBarOpen] = useState(false);

	const toggleLeftBar = (bool?: boolean) => {
		setIsLeftbarOpen(!bool);
	};
	const toggleRightBar = () => {
		setIsRightBarOpen(!isRightBarOpen);
	};
	// console.log(isLeftBarOpen);
	return (
		<>
			<Nav
				isLeftBarOpen={isLeftBarOpen}
				toggleLeftBar={toggleLeftBar}
				toggleRightBar={toggleRightBar}
			/>
			<Left isLeftBarOpen={isLeftBarOpen} />
			<Forum
				isLeftBarOpen={isLeftBarOpen}
				isRightBarOpen={isRightBarOpen}
				toggleLeftBar={toggleLeftBar}
				toggleRightBar={toggleRightBar}
			/>
			<Right isRightBarOpen={isRightBarOpen} />
		</>
	);
};

export default MainApp;
