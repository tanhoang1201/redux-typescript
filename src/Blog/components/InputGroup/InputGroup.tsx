// import React, { InputHTMLAttributes } from 'react';

// interface IProps extends InputHTMLAttributes<HTMLInputElement> {
// 	label?: string;
// }

// function InputGroup({ label, ...rest }: IProps) {
// 	return (
// 		<div className='mb-6'>
// 			<label htmlFor={rest.id} className='input-label'>
// 				{label}
// 			</label>
// 			<input className='input-style' {...rest} />
// 		</div>
// 	);
// }

// export default InputGroup;

import React, { InputHTMLAttributes } from 'react';

type IState<T1 extends keyof JSX.IntrinsicElements> = {};

type IProps<T extends keyof JSX.IntrinsicElements> = {
	label?: string;
	elementType: T;
} & JSX.IntrinsicElements[T];

function InputGroup<T extends keyof JSX.IntrinsicElements>({
	label,
	elementType,
	...rest
}: IProps<T>) {
	let Com = ;
	return (
		<div className='mb-6'>
			<label htmlFor={rest.id} className='input-label'>
				{label}
			</label>
			<Com className='input-style' {...rest} />
		</div>
	);
}

export default InputGroup;
