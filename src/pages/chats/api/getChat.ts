import {get} from '../../../shared/api/api';
import {Chat} from '../../../entities/Chat/Chat';

export async function getChat(userId: number): Promise<Chat> {
	try {
		const response = await get(`/api/message/getchat?userID=${userId}`);
		const chat: Chat = await response.json();
		return chat;

	} catch (error) {
		//console.error(error);
		return null;
	}
}