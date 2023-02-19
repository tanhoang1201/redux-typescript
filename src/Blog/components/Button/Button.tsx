import React, { ButtonHTMLAttributes } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const Button = ({ children, ...rest }: IProps) => {
	return (
		<button className='button-style group' type='submit' {...rest}>
			<span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
				{children}
			</span>
		</button>
	);
};

export default Button;
