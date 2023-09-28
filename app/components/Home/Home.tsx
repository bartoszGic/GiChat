import Button from '../UI/Button';
import Link from 'next/link';

const Home = () => {
	return (
		<div className='flex flex-col items-center mt-2'>
			<header className='flex flex-col items-center my-8'>
				<h1 className='text-4xl font-bold tracking-widest'>GiChat</h1>
			</header>
			<p className='text-center mx-4'>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, in!
			</p>
			<Link
				href='/Login'
				className='mt-8'>
				<Button
					text={'Login'}
					backgroundColor={'bg-blue-500'}
				/>
			</Link>
		</div>
	);
};
export default Home;
