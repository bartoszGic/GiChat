'use client';
import React from 'react';
import { useState } from 'react';
import Left from './LeftPanel/Left';
import Nav from './Nav/Nav';
import Right from './RightPanel/Right';
import Forum from './Forum/Forum';
import ImageModal from './UI/ImageModal';
import { TransformedUserChat } from './Types/types';

const MainApp = () => {
	// console.log('Main');
	const [isLeftBarOpen, setIsLeftbarOpen] = useState(false);
	const [isRightBarOpen, setIsRightBarOpen] = useState(false);
	const [forumStyleZ, setForumStyleZ] = useState('z-0');
	const [showImage, setShowImage] = useState(false);
	const [image, setImage] = useState('');
	const [userChats, setUserChats] = useState<TransformedUserChat[]>([]);

	const toggleLeftBar = (bool?: boolean) => {
		setIsLeftbarOpen(!bool);
	};
	const toggleRightBar = () => {
		setIsRightBarOpen(!isRightBarOpen);
	};

	return (
		<>
			{showImage && (
				<ImageModal
					setShowImage={setShowImage}
					image={image}
				/>
			)}
			<Nav
				isLeftBarOpen={isLeftBarOpen}
				toggleLeftBar={toggleLeftBar}
				toggleRightBar={toggleRightBar}
				isRightBarOpen={isRightBarOpen}
				setForumStyleZ={setForumStyleZ}
				userChats={userChats}
			/>
			<Left
				isLeftBarOpen={isLeftBarOpen}
				toggleLeftBar={toggleLeftBar}
				userChats={userChats}
				setUserChats={setUserChats}
			/>
			<Forum
				isLeftBarOpen={isLeftBarOpen}
				toggleLeftBar={toggleLeftBar}
				forumStyleZ={forumStyleZ}
				setShowImage={setShowImage}
				setImage={setImage}
			/>
			<Right
				isRightBarOpen={isRightBarOpen}
				toggleRightBar={toggleRightBar}
			/>
		</>
	);
};

export default MainApp;