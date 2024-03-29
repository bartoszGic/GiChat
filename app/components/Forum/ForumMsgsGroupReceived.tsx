import Image from 'next/image';
import { Message, formatDate } from '../Types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

type ForumMsgsGroupReceivedProps = {
	message: Message;
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	setImage: React.Dispatch<React.SetStateAction<string>>;
};
const ForumMsgsGroupReceived = ({
	message,
	setShowImage,
	setImage,
}: ForumMsgsGroupReceivedProps) => {
	return (
		<li
			key={message.id}
			className='flex mb-2 w-full text-xs break-words'>
			{message.photoURL ? (
				<Image
					className='h-6 w-6 rounded-full mr-2'
					src={message.photoURL as string}
					alt='przesłany obraz'
					width={40}
					height={40}
				/>
			) : (
				<FontAwesomeIcon
					className='h-6 w-6 rounded-full mr-2'
					icon={faUser}
				/>
			)}

			<div className='flex flex-col bg-neutral-800 text-neutral-50 px-2 py-2 w-3/4 rounded-lg sm:max-w-[350px]'>
				<div className='flex text-neutral-600 items-center'>
					<div className='mr-2'>{message.displayName} </div>
					<div>{formatDate(message.date.seconds)}</div>
				</div>
				<div className='mt-2'>{message.message}</div>
				<div className='mt-2 text-justify rounded-lg'>
					{message.img && (
						<div
							className='flex flex-col cursor-pointer mt-2'
							onClick={() => {
								setShowImage(true);
								setImage(message.img as string);
							}}>
							<Image
								className='w-40 h-auto overflow-hidden rounded-md'
								src={message.img as string}
								alt='przesłany obraz'
								width={160}
								height={160}
								priority
							/>
						</div>
					)}
				</div>
			</div>
		</li>
	);
};

export default ForumMsgsGroupReceived;
