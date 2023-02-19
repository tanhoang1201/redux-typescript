import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import PostItem from './components/PostItem';
import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getPosts } from './blog.slice';
import Skeleton from './components/Skeleton';

const BlogList = () => {
	const dispatch = useAppDispatch();
	const posts = useSelector((state: RootState) => state.posts.posts);
	const loading = useSelector((state: RootState) => state.posts.loading);
	useEffect(() => {
		const promise = dispatch(getPosts());
		return () => {
			promise.abort();
		};
	}, []);
	return (
		<div className='bg-white py-6 sm:py-8 lg:py-12'>
			<div className='mx-auto max-w-screen-xl px-4 md:px-8'>
				<div className='mb-10 md:mb-16'>
					<h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>
						Được Dev Blog
					</h2>
					<p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
						Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có
						nắng
					</p>
				</div>
				<div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
					{loading && (
						<Fragment>
							<Skeleton />
							<Skeleton />
						</Fragment>
					)}
					{!loading && posts.map((post) => <PostItem key={post.id} post={post} />)}
				</div>
			</div>
		</div>
	);
};

export default BlogList;
