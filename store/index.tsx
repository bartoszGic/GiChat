import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import authSlice from './auth-slice';
import storage from './customStorage';
import chatSlice from './chat-slice';
// import logger from 'redux-logger';

const authPersistConfig = {
	key: 'auth',
	storage: storage,
	whitelist: ['uid', 'email', 'displayName', 'photoURL'],
};
const chatPersistConfig = {
	key: 'chat',
	storage: storage,
	whitelist: ['chatKey', 'chatID', 'displayName', 'photoURL'],
};
const authReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authSlice),
	chat: persistReducer(chatPersistConfig, chatSlice),
});
export const store = configureStore({
	reducer: authReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({ serializableCheck: false }),
	// .concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
