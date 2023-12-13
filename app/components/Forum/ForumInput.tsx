import React, { useState } from 'react';
import Button from '../UI/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faImage,
	faPaperPlane,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import {
	arrayUnion,
	doc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/firebase-config';
import { useAppSelector } from '@/store';

type ForumInput = {
	isLeftBarOpen: boolean;
};
const ForumInput = ({ isLeftBarOpen }: ForumInput) => {
	const [message, setMessage] = useState('');
	const [image, setImage] = useState<File | undefined>();
	const [imageURL, setImageURL] = useState<string | null>(null);

	const chat = useAppSelector(state => state.chat);
	const auth = useAppSelector(state => state.auth);

	const handleForumInputImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onload = e => {
				if (e.target !== null) setImageURL(e.target.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	const sendMessage = async () => {
		if (!image) {
			try {
				await updateDoc(
					doc(db, 'allUsersChatMessages', chat.chatKey as string),
					{
						messages: arrayUnion({
							id: uuidv4(),
							message,
							date: Timestamp.now(),
							authorID: auth.uid,
							displayName: auth.displayName,
						}),
					}
				);
			} catch (error) {
				console.log(error);
			}
		} else if (image) {
			const date = new Date().getTime();
			const storageRef = ref(storage, `${chat.chatKey}+${date}`);
			try {
				await uploadBytesResumable(storageRef, image);
				const downloadURL = await getDownloadURL(storageRef);
				await updateDoc(
					doc(db, 'allUsersChatMessages', chat.chatKey as string),
					{
						messages: arrayUnion({
							id: uuidv4(),
							message,
							date: Timestamp.now(),
							authorID: auth.uid,
							displayName: auth.displayName,
							img: downloadURL,
						}),
					}
				);
			} catch (error) {
				console.log(error);
			}
		}
		try {
			await updateDoc(doc(db, 'userChats', auth.uid as string), {
				[`${chat.chatKey}.author`]: auth.uid,
				[`${chat.chatKey}.date`]: Timestamp.now(),
			});

			await updateDoc(doc(db, 'userChats', chat.chatID as string), {
				[`${chat.chatKey}.author`]: auth.uid,
				[`${chat.chatKey}.date`]: Timestamp.now(),
				[`${chat.chatKey}.isReaded`]: false,
			});
		} catch (error) {
			console.log(error);
		}

		setMessage('');
		setImage(undefined);
		setImageURL(null);
	};
	return (
		<div
			className={`${
				isLeftBarOpen ? 'hidden sm:flex' : 'flex'
			}  w-full h-11 justify-between bg-slate-50`}>
			<textarea
				className='flex text-slate-900 bg-slate-50 text-sm py-1 px-1 mr-2 resize-none w-2/3 sm:text-base'
				placeholder='Napisz wiadomość...'
				maxLength={200}
				id='message'
				onChange={e => setMessage(e.target.value)}
				value={message}
			/>
			<div className='flex items-center'>
				<>
					{imageURL && (
						<button>
							<FontAwesomeIcon
								className='w-4 h-4 mr-2 text-red-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
								icon={faXmark}
								onClick={() => {
									setImage(undefined);
									setImageURL(null);
								}}
							/>
						</button>
					)}
					<label
						htmlFor='picture'
						className='flex items-center justify-end mr-2'>
						<input
							onChange={e => handleForumInputImg(e)}
							className='hidden'
							type='file'
							accept='image/*'
							id='picture'
						/>
						<span>
							{imageURL ? (
								<Image
									className='h-8 w-8 cursor-pointer align-middle bg-center justify-end'
									src={imageURL as string}
									alt='obrazek'
									width={40}
									height={40}
									onError={e => console.error('Image loading error', e)}
								/>
							) : (
								<FontAwesomeIcon
									className='w-6 h-6 cursor-pointer text-green-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn mr-2'
									icon={faImage}
								/>
							)}
						</span>
					</label>
				</>
				<button onClick={sendMessage}>
					<FontAwesomeIcon
						className='w-6 h-6 mr-2 cursor-pointer  text-blue-500 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						icon={faPaperPlane}
					/>
				</button>
			</div>
		</div>
	);
};
export default ForumInput;
