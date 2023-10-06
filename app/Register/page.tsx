import Button from '../components/UI/Button';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Register = () => {
	return (
		<div className='flex flex-col items-center my-8'>
			<h2 className='text-xl lett tracking-wide'>Rejestracja</h2>
			<form className='flex flex-col items-center mt-4'>
				<input
					className='py-2 px-4 m-4 text-slate-700'
					type='text'
					id='username'
					name='username'
					placeholder='Email:'
				/>
				<input
					className='py-2 px-4 m-4 text-slate-700'
					type='password'
					id='password'
					name='password'
					placeholder='Hasło:'
				/>
				<input
					className='py-2 px-4 m-4 text-slate-700'
					type='password'
					id='passwordConfirm'
					name='passwordConfirm'
					placeholder='Powtórz hasło:'
				/>
				<label
					className='flex w-full p-4'
					htmlFor='avatar'>
					<button
						className='flex animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'
						type='submit'>
						<FontAwesomeIcon
							className='w-6 h-6'
							icon={faUser}
						/>
						<span className='ml-2'>Dodaj avatar</span>
					</button>
				</label>
				<p className='w-full text-sm text-left px-4 mt-4'>
					Masz konto?
					<Link href='/Login'>
						<button className='text-green-500 font-bold ml-2 animate-animeOffBtn hover:animate-animeBtn active:animate-animeBtn'>
							Zaloguj się
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
						text={'Zarejestruj'}
						backgroundColor={'bg-blue-500'}
					/>
				</div>
			</form>
		</div>
	);
};

export default Register;
