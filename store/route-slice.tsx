import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const routeSlice = createSlice({
	name: 'route',
	initialState: {
		mainApp: false,
	},
	reducers: {
		switchToMainApp(state, action: PayloadAction<boolean>) {
			state.mainApp = action.payload;
		},
	},
});
export const { switchToMainApp } = routeSlice.actions;
export default routeSlice.reducer;
