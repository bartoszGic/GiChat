import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { UserChat, TransformedUserChat } from '../Types/types';
import LeftRoomsAdd from './LeftRoomsAdd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import LeftRoomsRoom from './LeftRoomsRoom';
import { useAppSelector } from '@/store';
type LeftRoomsProps = {
	userChats: TransformedUserChat[] | undefined;
	userRooms: TransformedUserChat[];
	toggleLeftBar: (bool?: boolean) => void;
	setLoadingForum: React.Dispatch<React.SetStateAction<boolean>>;
	setNumberOfNotifications: React.Dispatch<React.SetStateAction<number>>;
};

const LeftRooms = ({
	userChats,
	userRooms,
	toggleLeftBar,
	setLoadingForum,
	setNumberOfNotifications,
}: LeftRoomsProps) => {
	const auth = useAppSelector(state => state.auth);
	const [showList, setShowList] = useState(false);
	const [roomUsers, setRoomUsers] = useState<TransformedUserChat[]>([]);
	const [image, setImage] = useState<File | null>(null);
	const [imageURL, setImageURL] = useState<string | null>(null);
	const usersListRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const outsideClickCatch = (e: MouseEvent) => {
			if (usersListRef.current) {
				const target = e.target as Node;
				if (!usersListRef.current.contains(target)) {
					setShowList(false);
					setRoomUsers([]);
					setImage(null);
					setImageURL(null);
				}
			}
		};
		document.addEventListener('mousedown', outsideClickCatch);
		return () => {
			document.removeEventListener('mousedown', outsideClickCatch);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<button
				className='flex items-center ml-2 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
				onClick={() => setShowList(state => !state)}>
				<h3 className='mr-2'>Grupy</h3>
				<FontAwesomeIcon
					className='text-cyan-500'
					icon={faPlus}
				/>
			</button>
			<LeftRoomsAdd
				usersListRef={usersListRef}
				showList={showList}
				roomUsers={roomUsers}
				setShowList={setShowList}
				setRoomUsers={setRoomUsers}
				userChats={userChats}
				image={image}
				setImage={setImage}
				imageURL={imageURL}
				setImageURL={setImageURL}
			/>
			<ul className='flex flex-col'>
				{userRooms.map(room => (
					<LeftRoomsRoom
						chatKey={room.key}
						key={room.uid}
						id={room.uid}
						friendsInRoom={room.friendsInRoom}
						photoURL={room.photoURL}
						displayName={room.displayName}
						toggleLeftBar={toggleLeftBar}
						setLoadingForum={setLoadingForum}
						setNumberOfNotifications={setNumberOfNotifications}
					/>
				))}
			</ul>
		</>
	);
};

export default LeftRooms;
