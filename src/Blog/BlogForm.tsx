import { useForm, SubmitHandler } from 'react-hook-form';
import { Post } from '../@types';
import Button from './components/Button';
import InputGroup from './components/InputGroup';
import { useSelector } from 'react-redux';
import { addPost, cancelEditPost, updatePost } from './blog.slice';
import { RootState, useAppDispatch } from '../redux/store';
import { Fragment, useEffect, useState } from 'react';

interface ErrorForm {
	publishDate: string | null;
}

const BlogForm = () => {
	const [error, setError] = useState<ErrorForm | null>(null);
	const dispatch = useAppDispatch();
	const { register, handleSubmit, reset } = useForm<Post>();
	const postEdit = useSelector((state: RootState) => state.posts.postEdit);

	useEffect(() => {
		if (postEdit) {
			reset(postEdit);
		}
	}, [postEdit]);
	const handleAddPost: SubmitHandler<Post> = async (formData) => {
		if (postEdit) {
			dispatch(updatePost(formData))
				.unwrap()
				.then(() => {
					reset({
						description: '',
						featuredImage: '',
						id: '',
						publishDate: '',
						published: false,
						title: '',
					});
					setError(null);
				})
				.catch((error) => {
					setError(error.error);
				});
		} else {
			try {
				await dispatch(addPost(formData)).unwrap();
				reset({
					description: '',
					featuredImage: '',
					id: '',
					publishDate: '',
					published: false,
					title: '',
				});
				setError(null);
			} catch (error: any) {
				setError(error.error);
			}
		}
	};
	const handleCancelEditPost = () => {
		dispatch(cancelEditPost());
	};

	return (
		<form onSubmit={handleSubmit(handleAddPost)} onReset={handleCancelEditPost}>
			<InputGroup placeholder='Title' required id='title' label='Title' register={register} />
			<InputGroup
				required
				placeholder='URL image'
				id='featuredImage'
				label='Featured Image'
				register={register}
			/>
			<div className='mb-6'>
				<div>
					<label htmlFor='description' className='input-label'>
						Description
					</label>
					<textarea
						id='description'
						rows={3}
						className='input-style'
						placeholder='Your description...'
						{...register('description')}
					/>
				</div>
			</div>
			<div>
				<InputGroup
					type={'datetime-local'}
					label='Publish Date'
					id='publishDate'
					register={register}
				/>
				{error?.publishDate && <p className='font-semibold text-red-700'>{error.publishDate}</p>}
			</div>
			<div className='mb-6 flex items-center'>
				<input
					id='publish'
					type='checkbox'
					className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
					{...register('published')}
				/>
				<label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
					Publish
				</label>
			</div>
			<div className='flex gap-3'>
				{!postEdit && <Button>Publish Post</Button>}
				{postEdit && (
					<Fragment>
						<Button type='submit'>Update Post</Button>
						<Button type='reset'>Cancel</Button>
					</Fragment>
				)}
			</div>
		</form>
	);
};

export default BlogForm;
