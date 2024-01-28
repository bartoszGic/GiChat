import React from 'react';
import Image from 'next/image';
type ImageModalProps = {
	setShowImage: React.Dispatch<React.SetStateAction<boolean>>;
	image: string;
};
const ImageModal = ({ setShowImage, image }: ImageModalProps) => {
	return (
		<div
			className='fixed inset-0 flex items-center justify-center bg-neutral-900 animate-animeBackdrop z-50'
			onClick={() => setShowImage(false)}>
			<div className='max-w-screen-lg w-full opacity-100'>
				<Image
					src={image as string}
					alt='przesłany obraz'
					width={1280}
					height={720}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			</div>
		</div>
	);
};

export default ImageModal;
