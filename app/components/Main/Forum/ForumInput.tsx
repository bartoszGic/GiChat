import React from 'react';
import Button from '../../UI/Button';

type ForumInput = {
	isLeftBarOpen: boolean;
};
const ForumInput = ({ isLeftBarOpen }: ForumInput) => {
	return (
		<form
			className={`${
				isLeftBarOpen ? 'hidden sm:flex' : 'flex'
			}  w-full h-11 justify-between bg-slate-500`}>
			<textarea
				className='flex text-slate-900 bg-slate-0 text-sm py-2 px-2 resize-none w-2/3'
				placeholder='Napisz wiadomość...'
				maxLength={200}
				id='message'
			/>
			<Button
				text={'Wyślij'}
				backgroundColor={'bg-blue-500'}
			/>
		</form>
	);
};

export default ForumInput;
