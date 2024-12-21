import { post } from '../../../shared/api/api';

export async function putLikeOrDislike(like: boolean, username: string): Promise<string> {
	try {
		const body = { 'receiver': username, 'type': like };
		await post('/api/communications/reaction', body);
		return 'true';

	} catch (error) {
		//console.error(error);
		if (error instanceof Error) {
            const errorMessage = error.message.split(', ').pop();
            return errorMessage;
        }
		return 'false';
	}
}