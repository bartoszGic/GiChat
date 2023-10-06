type Props = {
	onClick: (bool?: boolean) => void;
	bool?: boolean;
};

const Backdrop = ({ onClick, bool }: Props) => {
	const handleClick = () => {
		bool ? onClick(bool) : onClick();
	};
	return (
		<div
			onClick={handleClick}
			className='absolute max-w-4xl mx-auto w-screen h-screen bg-slate-900 opacity-75 z-10'></div>
	);
};
export default Backdrop;
