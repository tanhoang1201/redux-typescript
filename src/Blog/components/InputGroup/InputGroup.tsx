import React, { InputHTMLAttributes } from 'react';
import { UseFormRegister, Path } from 'react-hook-form';
import { Post } from '../../../@types';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	id: Path<Post>;
	classes?: string;
	register: UseFormRegister<Post>;
}

function InputGroup({ label, classes, register, id, ...rest }: IProps) {
	return (
		<div className='mb-6'>
			<label htmlFor={id} className={`input-label ${classes}`}>
				{label}
			</label>
			<input className='input-style' {...rest} {...register(id)} />
		</div>
	);
}

export default InputGroup;
