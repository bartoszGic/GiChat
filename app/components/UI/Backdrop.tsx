type Props = {
	onClick: (bool?: boolean) => void;
	bool?: boolean;
	isRightBarOpen?: boolean;
};

const Backdrop = ({ onClick, bool, isRightBarOpen }: Props) => {
	const handleClick = () => {
		bool ? onClick(bool) : onClick();
	};
	console.log(isRightBarOpen);
	return (
		<div
			onClick={handleClick}
			className={`absolute max-w-4xl mx-auto mt-11 w-full h-calc bg-slate-900 opacity-75 sm:hidden animate-animeBackdrop z-30`}></div>
	);
};
export default Backdrop;
