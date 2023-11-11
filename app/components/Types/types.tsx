export type UserChat = {
	[key: string]: {
		date: {
			seconds: number;
			nanoseconds: number;
		};
		info: {
			displayName: string;
			photoURL: string;
			uid: string;
		};
	};
};
export type TransformedUserChat = {
	key: string;
	date: number;
	displayName: string;
	photoURL: string;
	uid: string;
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
	img?: string;
};
