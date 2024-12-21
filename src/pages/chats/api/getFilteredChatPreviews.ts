import { post } from '../../../shared/api/api';
import {ChatPreview} from '../../../entities/ChatPreview/ChatPreview';

export async function getFilteredChatPreviews(name: string): Promise<ChatPreview[]> {
	try {
        const body = {
			'search': name,
			'page': 1,
		};
		const response = await post('/api/message/chatsearch', body);
		const data = await response.json();
		if (data.Responses === null)
			return null;
		const previews: ChatPreview[] = data.Responses.map((response: any) => response as ChatPreview);
		return previews;

	} catch (error) {
		//console.error(error);
		return [];
	}
}