import Button from '../components/UI/Button';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Login = () => {
	return (
		<div className='flex flex-col items-center my-8'>
			<h2 className='text-xl lett tracking-wide'>Zaloguj się do GiChat</h2>
			<form className='flex flex-col items-center mt-4'>
				<div className='p-4'>
					<input
						className='py-2 px-4 text-slate-700'
						type='text'
						id='username'
						name='username'
						placeholder='Email:'
					/>
				</div>
				<div className='p-4'>
					<input
						className='py-2 px-4 text-slate-700'
						type='password'
						id='password'
						name='password'
						placeholder='Hasło:'
					/>
				</div>
				<p className='w-full text-sm text-left px-4 mt-4'>
					Nie masz konta?
					<Link href='/Register'>
						<button className='text-green-500 font-bold ml-2 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
							Zarejestruj się
						</button>
					</Link>
				</p>
				<div className='flex justify-between w-full p-4 mt-4 '>
					<Link href='/'>
						<button>
							<FontAwesomeIcon
								className='w-8 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
								icon={faArrowLeft}
							/>
						</button>
					</Link>

					<Button
						text={'Zaloguj'}
						backgroundColor={'bg-blue-500'}
					/>
				</div>
			</form>
		</div>
	);
};

export default Login;