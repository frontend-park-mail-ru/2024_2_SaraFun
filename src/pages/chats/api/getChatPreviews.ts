import {get} from '../../../shared/api/api';
import {ChatPreview} from '../../../entities/ChatPreview/ChatPreview';

export async function getChatPreviews(): Promise<ChatPreview[]> {
	try {
		const response = await get('/api/message/chats');
		const data = await response.json();
		if (data.responses === null)
			return null;
		const previews: ChatPreview[] = data.responses.map((response: any) => response as ChatPreview);
		return previews;

	} catch (error) {
		//console.error(error);
		return [];
	}
}