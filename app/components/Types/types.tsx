export type UserChat = {
	[key: string]: {
		author: string;
		isReaded: boolean;
		date: {
			seconds: number;
			nanoseconds: number;
		};
		info: {
			displayName: string;
			photoURL: string;
			uid: string;
			friendsInRoom: UserInRoom[];
		};
	};
};
export type TransformedUserChat = {
	key: string;
	date: number;
	displayName: string;
	photoURL: string;
	uid: string;
	isReaded: boolean;
	friendsInRoom: UserInRoom[];
};
export type Message = {
	id: string;
	message: string;
	date: {
		seconds: number;
		nanoseconds: number;
	};
	displayName: string;
	authorID: string;
	photoURL: string | null;
	img?: string;
	isReaded?: object[];
};
export type User = {
	uid: string;
	displayName: string;
	email: string;
	photoURL: string;
};
export type UserInRoom = {
	uid: string;
	displayName: string;
	email: string;
	isReaded: boolean;
};
export const formatDate = (timestamp: number) => {
	const date = new Date(timestamp * 1000);
	const currentDate = new Date();
	const currentDay = currentDate.getDate().toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	if (currentDay > day) {
		return `${day}.${month}.${year} ${hours}:${minutes} `;
	} else {
		return `dzisiaj ${hours}:${minutes}`;
	}
};
