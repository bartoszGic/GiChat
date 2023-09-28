import React from 'react';

interface ButtonProps {
	text: string;
	backgroundColor?: string;
	href?: string;
	onClick?: () => void;
}

const Button = ({ text, backgroundColor, onClick }: ButtonProps) => {
	const buttonClasses = `${
		backgroundColor ? backgroundColor : 'bg-slate-900'
	} px-4 py-2 relative group font-medium text-slate-100 inline-block`;

	return (
		<button
			className={buttonClasses}
			onClick={onClick}>
			<span
				className={`absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-slate-700 group-hover:h-full opacity-100`}></span>
			<span className='relative'>{text}</span>
		</button>
	);
};

export default Button;
