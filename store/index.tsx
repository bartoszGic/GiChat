import { configureStore } from '@reduxjs/toolkit';
import routeSlice from './route-slice';

const store = configureStore({
	reducer: {
		route: routeSlice,
	},
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
