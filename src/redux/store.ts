import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import blogReducer from '../Blog/blog.slice';

const store = configureStore({
	reducer: {
		posts: blogReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
