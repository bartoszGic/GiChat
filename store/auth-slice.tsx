import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
	uid: string | null;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
};
const initialState: UserState = {
	uid: null,
	email: null,
	displayName: null,
	photoURL: null,
};
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loadUser(state, action: PayloadAction<UserState>) {
			return { ...state, ...action.payload };
		},
		logOutUser(state) {
			return initialState;
		},
	},
});
export const { loadUser, logOutUser } = authSlice.actions;
export default authSlice.reducer;
