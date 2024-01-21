import React from 'react';

interface ButtonProps {
	text: string;
	backgroundColor?: string;
	href?: string;
	onClick?: () => void;
}

const Button = ({ text, backgroundColor, onClick }: ButtonProps) => {
	const buttonClasses = `${
		backgroundColor ? backgroundColor : 'bg-gray-950'
	} px-12 py-4 relative group rounded-full font-medium text-gray-50 inline-block`;

	return (
		<button
			className={buttonClasses}
			onClick={onClick}>
			<span
				className={`absolute rounded-full top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-gray-950 group-hover:h-full group-hover:scale-105`}></span>
			<span className='relative text-xl tracking-widest'>{text}</span>
		</button>
	);
};

export default Button;
