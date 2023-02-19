import {
	createSlice,
	PayloadAction,
	current,
	createAsyncThunk,
	AsyncThunk,
} from '@reduxjs/toolkit';
import { Post } from '../@types';
import http from '../utils/http';

interface BlogState {
	posts: Post[];
	postEdit: Post | null;
	loading: boolean;
	currentRequestId: string | undefined;
}

const initialState: BlogState = {
	posts: [],
	postEdit: null,
	loading: false,
	currentRequestId: undefined,
};

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

export const getPosts = createAsyncThunk('post/getPosts', async (params, thunkApi) => {
	const res = await http.instance.get<Post[]>('/posts', {
		signal: thunkApi.signal,
	});
	return res.data;
});

export const addPost = createAsyncThunk(
	'post/addPost',
	async (Post: Omit<Post, 'id'>, thunkApi) => {
		try {
			const res = await http.instance.post<Post>('/posts', Post, {
				signal: thunkApi.signal,
			});
			return res.data;
		} catch (error: any) {
			if (error.name === 'AxiosError' && error.response.status === 422) {
				return thunkApi.rejectWithValue(error.response.data);
			}
			throw error;
		}
	}
);

export const updatePost = createAsyncThunk('post/updatePost', async (Post: Post, thunkApi) => {
	try {
		const res = await http.instance.put<Post>(`/posts/${Post.id}`, Post, {
			signal: thunkApi.signal,
		});
		return res.data;
	} catch (error: any) {
		if (error.name === 'AxiosError' && error.response.status === 422) {
			return thunkApi.rejectWithValue(error.response.data);
		}
		throw error;
	}
});

export const delPost = createAsyncThunk('post/delPost', async (postId: string, thunkApi) => {
	const res = await http.instance.delete<string>(`/posts/${postId}`, {
		signal: thunkApi.signal,
	});
	return postId;
});

const postSlice = createSlice({
	name: 'post',
	initialState: initialState,
	reducers: {
		startEditPost: (state, action: PayloadAction<string>) => {
			const currentPost = state.posts.find((post) => post.id === action.payload) || null;
			state.postEdit = currentPost;
		},
		cancelEditPost: (state) => {
			state.postEdit = null;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(updatePost.fulfilled, (state, action) => {
				state.posts.some((post, index) => {
					if (post.id === action.payload.id) {
						state.posts[index] = action.payload;
						return true;
					}
					return false;
				});
				state.postEdit = null;
			})
			.addCase(addPost.fulfilled, (state, action) => {
				state.posts.push(action.payload);
			})
			.addCase(getPosts.fulfilled, (state, action) => {
				state.posts = action.payload;
			})
			.addCase(delPost.fulfilled, (state, action) => {
				const index = state.posts.findIndex((post) => post.id === action.payload);
				state.posts.splice(index, 1);
			})
			.addMatcher<PendingAction>(
				(action) => action.type.endsWith('/pending'),
				(state, action) => {
					state.loading = true;
					state.currentRequestId = action.meta.requestId;
				}
			)
			.addMatcher<RejectedAction | FulfilledAction>(
				(action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
				(state, action) => {
					if (state.loading && state.currentRequestId === action.meta.requestId) {
						state.loading = false;
						state.currentRequestId = undefined;
					}
				}
			);
	},
});

export const { cancelEditPost, startEditPost } = postSlice.actions;
const blogReducer = postSlice.reducer;
export default blogReducer;
