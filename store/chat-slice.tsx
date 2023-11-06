import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
	chatKey: string | null;
	chatID: string | null;
	displayName: string | null;
	photoURL: string | null;
};
const initialState: UserState = {
	chatKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_KEY as string,
	chatID: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_UID as string,
	displayName: process.env
		.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_DISPLAY_NAME as string,
	photoURL: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_FORUM_PHOTO_URL as string,
};
const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		changeUserChat(state, action: PayloadAction<UserState>) {
			return { ...state, ...action.payload };
		},
		logoutUserChat(state) {
			return initialState;
		},
	},
});
export const { changeUserChat, logoutUserChat } = chatSlice.actions;
export default chatSlice.reducer;
