'use client';
import React from 'react';
import { useState } from 'react';
import Left from './LeftPanel/Left';
import Nav from './Nav/Nav';
import Right from './RightPanel/Right';
import Forum from './Forum/Forum';
import ImageModal from './UI/ImageModal';
import { TransformedUserChat, User } from './Types/types';

const MainApp = () => {
	const [isLeftBarOpen, setIsLeftbarOpen] = useState(false);
	const [isRightBarOpen, setIsRightBarOpen] = useState(false);
	const [forumStyleZ, setForumStyleZ] = useState('z-0');
	const [showImage, setShowImage] = useState(false);
	const [image, setImage] = useState('');
	const [userChats, setUserChats] = useState<TransformedUserChat[]>([]);
	const [userRooms, setUserRooms] = useState<TransformedUserChat[]>([]);
	const [mainChat, setMainChat] = useState<TransformedUserChat[]>([]);
	const [arrayOfActualDetails, setArrayOfActualDetails] = useState<User[]>([]);
	const [loadingForum, setLoadingForum] = useState(false);
	const [friendReadMsg, setFriendReadMsg] = useState(false);
	const [numberOfNotifications, setNumberOfNotifications] = useState(0);

	const toggleLeftBar = (bool?: boolean) => {
		setIsLeftbarOpen(!bool);
	};
	const toggleRightBar = () => {
		setIsRightBarOpen(!isRightBarOpen);
	};

	return (
		<div className='flex h-svh'>
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
				numberOfNotifications={numberOfNotifications}
			/>
			<Left
				isLeftBarOpen={isLeftBarOpen}
				toggleLeftBar={toggleLeftBar}
				userChats={userChats}
				setUserChats={setUserChats}
				setUserRooms={setUserRooms}
				userRooms={userRooms}
				setLoadingForum={setLoadingForum}
				setArrayOfActualDetails={setArrayOfActualDetails}
				arrayOfActualDetails={arrayOfActualDetails}
				setNumberOfNotifications={setNumberOfNotifications}
				setFriendReadMsg={setFriendReadMsg}
				setMainChat={setMainChat}
				mainChat={mainChat}
			/>
			<Forum
				isLeftBarOpen={isLeftBarOpen}
				toggleLeftBar={toggleLeftBar}
				forumStyleZ={forumStyleZ}
				setShowImage={setShowImage}
				setImage={setImage}
				loadingForum={loadingForum}
				arrayOfActualDetails={arrayOfActualDetails}
				friendReadMsg={friendReadMsg}
				userRooms={userRooms}
				mainChat={mainChat}
			/>
			<Right
				isRightBarOpen={isRightBarOpen}
				toggleRightBar={toggleRightBar}
			/>
		</div>
	);
};

export default MainApp;
